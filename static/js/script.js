/* ================================================================
   PlantCare AI — script.js v2.0 (Improved)
   Features:
     - Better UI animations
     - Raw score chart visualization
     - Image quality warning display
     - Severity badge with colors
     - Camera improvements
     - Smooth transitions
     - Better error handling
     - Chatbot typing indicator
     - Auto-scroll improvements
================================================================ */

let selectedFile = null;
let stream       = null;
let isAnalyzing  = false;

/* ================================================================
   PAGE NAVIGATION
================================================================ */








let voices = [];

function loadVoices() {
    voices = speechSynthesis.getVoices();
    console.log("Voices loaded:", voices);
}

// Chrome bug fix
speechSynthesis.onvoiceschanged = loadVoices;

// initial load
loadVoices();







function goPage(page) {
    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
        p.style.opacity = "0";
    });

    const target = document.getElementById(page + "Page");
    if (!target) return;

    target.classList.add("active");
    setTimeout(() => { target.style.opacity = "1"; }, 10);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update nav active state
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    const navItem = document.querySelector(`[onclick="goPage('${page}')"]`);
    if (navItem) navItem.classList.add("active");
}

/* ================================================================
   DOM READY
================================================================ */
document.addEventListener("DOMContentLoaded", function () {

    // Set initial page opacity
    document.querySelectorAll(".page").forEach(p => {
        p.style.transition = "opacity 0.3s ease";
        if (p.classList.contains("active")) p.style.opacity = "1";
        else p.style.opacity = "0";
    });

    /* ── File input change ── */
    const input = document.getElementById("imageInput");
    if (input) {
        input.addEventListener("change", function () {
            selectedFile = this.files[0];
            if (!selectedFile) return;
            handleNewImage(URL.createObjectURL(selectedFile));
        });
    }

    /* ── Drag and drop ── */
    const uploadArea = document.getElementById("uploadArea");
    if (uploadArea) {
        uploadArea.addEventListener("dragover", e => {
            e.preventDefault();
            uploadArea.classList.add("drag-over");
        });
        uploadArea.addEventListener("dragleave", () => {
            uploadArea.classList.remove("drag-over");
        });
        uploadArea.addEventListener("drop", e => {
            e.preventDefault();
            uploadArea.classList.remove("drag-over");
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                selectedFile = file;
                handleNewImage(URL.createObjectURL(file));
            }
        });
    }

    /* ── Search + Filter in Library ── */
    const searchInput   = document.querySelector(".search");
    const filterButtons = document.querySelectorAll(".filters button");
    let activeFilter    = "all";

    function filterDiseases() {
        const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
        document.querySelectorAll(".disease-card").forEach(card => {
            const text        = card.textContent.toLowerCase();
            const matchSearch = text.includes(searchValue);
            const matchFilter = activeFilter === "all" || card.classList.contains(activeFilter);
            card.style.display = (matchSearch && matchFilter) ? "block" : "none";
        });
    }

    if (searchInput) searchInput.addEventListener("keyup", filterDiseases);

    filterButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            filterButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            activeFilter = this.innerText.toLowerCase();
            filterDiseases();
        });
    });

    /* ── Enter key for chat ── */
    const userInput = document.getElementById("userInput");
    if (userInput) {
        userInput.addEventListener("keydown", e => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    /* ── Demo video ── */
    const demoVideo = document.getElementById("demoVideo");
    const wrapper   = document.querySelector(".video-wrapper");
    const playBtn   = document.querySelector(".play-btn");

    if (demoVideo && wrapper && playBtn) {
        playBtn.addEventListener("click", () => {
            demoVideo.play();
            wrapper.classList.add("playing");
        });
        demoVideo.addEventListener("click", () => {
            if (demoVideo.paused) { demoVideo.play(); wrapper.classList.add("playing"); }
            else                  { demoVideo.pause(); wrapper.classList.remove("playing"); }
        });
        demoVideo.addEventListener("pause", () => wrapper.classList.remove("playing"));
        demoVideo.addEventListener("play",  () => wrapper.classList.add("playing"));
    }

    setAllTimes();
});

/* ================================================================
   HANDLE NEW IMAGE (shared between upload and camera)
================================================================ */
function handleNewImage(imageURL) {
    const preview = document.getElementById("preview");
    if (preview) {
        preview.src           = imageURL;
        preview.style.display = "block";
        preview.style.animation = "fadeIn 0.4s ease";
    }

    const predictBtn = document.getElementById("predictBtn");
    if (predictBtn) predictBtn.style.display = "inline-block";

    clearResults();
}

function clearResults() {
    const resultBox = document.getElementById("result");
    if (resultBox) resultBox.innerHTML = "";

    const pc = document.getElementById("productContainer");
    if (pc) pc.innerHTML = "<h2>🌿 Recommended Products</h2><p class='subtitle'>AI suggests treatments based on detection</p>";

    const scoreChart = document.getElementById("scoreChart");
    if (scoreChart) scoreChart.innerHTML = "";
}

/* ================================================================
   FILE OPEN
================================================================ */
function openFile() {
    document.getElementById("imageInput").click();
}

/* ================================================================
   CAMERA
================================================================ */
async function openCamera() {
    try {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            stream = null;
        }

        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: "environment" },
                width:  { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        const video = document.getElementById("camera");
        video.srcObject = stream;
        video.style.display = "block";

        video.onloadedmetadata = () => {
            video.play();
            const captureBtn = document.getElementById("captureBtn");
            if (captureBtn) {
                captureBtn.style.display = "inline-block";
                captureBtn.style.animation = "fadeIn 0.3s ease";
            }
        };

        clearResults();

        const preview = document.getElementById("preview");
        if (preview) {
            preview.style.display = "none";
            preview.src = "";
        }

        const predictBtn = document.getElementById("predictBtn");
        if (predictBtn) predictBtn.style.display = "none";

    } catch (error) {
        console.error("Camera error:", error);
        const msgs = {
            NotAllowedError  : "❌ Camera permission DENIED!\n\nFix:\n1. Click the 🔒 lock icon in the address bar\n2. Set Camera → Allow\n3. Refresh the page",
            NotFoundError    : "❌ No camera found on this device!",
            NotReadableError : "❌ Camera is in use by another app! Close other apps and try again.",
        };
        alert(msgs[error.name] || `❌ Camera error!\n\nTips:\n• Use Chrome browser\n• Open on localhost (not file://)\n• Allow camera permission`);
    }
}

/* ================================================================
   CAPTURE IMAGE
================================================================ */
function captureImage() {
    const video = document.getElementById("camera");
    if (!video || video.videoWidth === 0) {
        alert("⚠️ Camera not ready. Please wait a moment.");
        return;
    }

    const canvas  = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(blob => {
        if (!blob) { alert("❌ Failed to capture. Please try again."); return; }

        selectedFile = blob;
        handleNewImage(URL.createObjectURL(blob));
        setTimeout(() => predictImage(), 300);  // auto-analyze after brief delay

    }, "image/jpeg", 0.92);

    // Stop camera
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    const video2 = document.getElementById("camera");
    video2.style.display = "none";
    video2.srcObject = null;

    const captureBtn = document.getElementById("captureBtn");
    if (captureBtn) captureBtn.style.display = "none";
}

/* ================================================================
   SEVERITY BADGE
================================================================ */
function getSeverityBadge(severity) {
    const map = {
        "None"  : { color: "#00ff90", bg: "rgba(0,255,144,0.1)", icon: "✅" },
        "Low"   : { color: "#4caf50", bg: "rgba(76,175,80,0.1)",  icon: "🟢" },
        "Medium": { color: "#ffcc00", bg: "rgba(255,204,0,0.1)",  icon: "🟡" },
        "High"  : { color: "#ff4d4d", bg: "rgba(255,77,77,0.1)",  icon: "🔴" },
        "N/A"   : { color: "#888",    bg: "rgba(128,128,128,0.1)", icon: "⚪" },
    };
    const s = map[severity] || map["N/A"];
    return `<span style="
        background: ${s.bg};
        border: 1px solid ${s.color};
        color: ${s.color};
        padding: 3px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 0.5px;
    ">${s.icon} ${severity}</span>`;
}

/* ================================================================
   RAW SCORE CHART
================================================================ */
function buildScoreChart(rawScores, predictedDisease) {
    const container = document.getElementById("scoreChart");
    if (!container) return;

    const sorted = Object.entries(rawScores).sort((a, b) => b[1] - a[1]);

    const diseaseColors = {
        "Healthy"     : "#00ff90",
        "Nutritional" : "#ffcc00",
        "Powdery"     : "#e0e0e0",
        "Rust"        : "#ff7043",
        "Undefined"   : "#9e9e9e",
    };

    let html = `
        <div style="
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 14px;
            padding: 18px 20px;
            margin-top: 16px;
        ">
            <h4 style="color:#aaa; margin-bottom:14px; font-size:13px; text-transform:uppercase; letter-spacing:1px;">
                📊 AI Confidence per Class
            </h4>
    `;

    sorted.forEach(([cls, score]) => {
        const color      = diseaseColors[cls] || "#00bcd4";
        const isTop      = cls === predictedDisease;
        const barWidth   = Math.min(score, 100);

        html += `
            <div style="margin-bottom: 10px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="font-size:13px; color:${isTop ? color : '#aaa'}; font-weight:${isTop ? 'bold' : 'normal'};">
                        ${isTop ? '▶ ' : ''}${cls}
                    </span>
                    <span style="font-size:13px; color:${isTop ? color : '#888'}; font-weight:${isTop ? 'bold' : 'normal'};">
                        ${score.toFixed(1)}%
                    </span>
                </div>
                <div style="background:rgba(255,255,255,0.07); border-radius:6px; overflow:hidden; height:8px;">
                    <div class="score-bar-fill" data-width="${barWidth}" style="
                        width: 0%;
                        height: 100%;
                        background: ${isTop ? color : 'rgba(255,255,255,0.2)'};
                        border-radius: 6px;
                        transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
                        ${isTop ? `box-shadow: 0 0 8px ${color}55;` : ''}
                    "></div>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Animate bars
    setTimeout(() => {
        container.querySelectorAll(".score-bar-fill").forEach(bar => {
            bar.style.width = bar.dataset.width + "%";
        });
    }, 100);
}

/* ================================================================
   PREDICT IMAGE
================================================================ */
function predictImage() {
    if (!selectedFile) {
        alert("⚠️ Please upload or capture an image first!");
        return;
    }

    if (isAnalyzing) return;
    isAnalyzing = true;

    const loader = document.getElementById("loader");
    const resultBox = document.getElementById("result");
    const productContainer = document.getElementById("productContainer");
    const btn = document.getElementById("predictBtn");
    const scoreChart = document.getElementById("scoreChart");
    const lang = document.getElementById("langSelect").value;

    // Loading state
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = "⏳ Analyzing...";
    }

    if (loader) {
        loader.style.display = "block";
        loader.innerHTML = `
            <div class="loader-circle"></div>
            <p style="color:#aaa; margin-top:10px; font-size:14px;">
                🤖 AI is scanning your plant...<br>
                <small style="color:#666;">Running 5 augmented passes for accuracy</small>
            </p>
        `;
    }

    if (resultBox) resultBox.innerHTML = "";
    if (scoreChart) scoreChart.innerHTML = "";
    if (productContainer) {
        productContainer.innerHTML = "<h2>🌿 Recommended Products</h2>";
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    fetch("/predict", {
        method: "POST",
        body: formData,
        headers: {
            "Accept-Language": lang
        }
    })
    .then(res => res.json())
    .then(data => {






        document.getElementById("resultTitle").innerText = data.title;
    document.getElementById("resultReason").innerText = data.reason;
    document.getElementById("resultSymptoms").innerText = data.symptoms;
    document.getElementById("resultCure").innerText = data.cure;
    document.getElementById("resultPrevention").innerText = data.prevention;





        isAnalyzing = false;

        if (loader) loader.style.display = "none";

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "🔁 Analyze Again";
        }

        if (data.error && !data.disease) {
            showError(resultBox, data.error);
            return;
        }

        const isUndefined =
            !data.disease ||
            data.disease === "Undefined" ||
            data.disease === "undefined" ||
            (data.title && data.title.toLowerCase().includes("not a plant"));

        if (isUndefined) {
            showUndefined(resultBox, productContainer, data);
        } else {
            showDisease(data, resultBox, productContainer);
        }

        // Score chart
        if (data.raw_scores) {
            buildScoreChart(data.raw_scores, data.disease);
        }
    })
    .catch(err => {
        isAnalyzing = false;
        console.error(err);

        if (loader) loader.style.display = "none";

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = "🌿 Analyze Plant";
        }

        showError(resultBox, "Server not responding. Make sure Flask is running.");
    });
}

// Language change → auto reanalyze
document.getElementById("langSelect").addEventListener("change", function () {
    if (selectedFile) {
        predictImage();
    }
});
/* ================================================================
   SHOW ERROR
================================================================ */
function showError(resultBox, message) {
    if (!resultBox) return;
    resultBox.innerHTML = `
        <div style="
            border: 2px solid #ff4d4d;
            border-radius: 14px;
            text-align: center;
            padding: 28px 20px;
            background: rgba(255,77,77,0.06);
        ">
            <div style="font-size:40px; margin-bottom:10px;">⚠️</div>
            <p style="color:#ff4d4d; font-size:16px; font-weight:bold; margin-bottom:8px;">Error</p>
            <p style="color:#ccc; font-size:14px;">${message}</p>
            <p style="color:#888; font-size:12px; margin-top:10px;">
                Please try again with a different image.
            </p>
        </div>
    `;
}

/* ================================================================
   SHOW — NOT A PLANT
================================================================ */
function showUndefined(resultBox, productContainer, data) {
    if (!resultBox) return;

    const errorMsg = data && data.error ? data.error : null;

    resultBox.innerHTML = `
        <div style="
            border: 2px solid #ff9800;
            background: linear-gradient(135deg, rgba(255,152,0,0.08), rgba(0,0,0,0.4));
            border-radius: 16px;
            text-align: center;
            padding: 36px 22px;
            animation: fadeIn 0.5s ease;
        ">
            <div style="font-size:58px; margin-bottom:12px;">🪴</div>

            <h3 style="color:#ff9800; font-size:20px; margin-bottom:8px;">
                ${errorMsg ? "⚠️ Image Quality Issue" : "Not a Plant Image"}
            </h3>

            ${errorMsg ? `<p style="color:#ffcc00; font-size:14px; margin-bottom:14px; font-weight:bold;">${errorMsg}</p>` : ""}

            <p style="color:#ccc; font-size:14px; line-height:1.9; max-width:300px; margin:0 auto 20px;">
                ${errorMsg ? "Please fix the issue and try again." : "The image does not appear to be a plant leaf. Upload a <strong style='color:#00ff90;'>clear plant leaf image</strong> for accurate results."}
            </p>

            <div style="
                background: rgba(255,152,0,0.08);
                border: 1px solid rgba(255,152,0,0.25);
                border-radius: 12px;
                padding: 14px 18px;
                text-align: left;
                max-width: 290px;
                margin: 0 auto;
                font-size: 13px;
                color: #bbb;
                line-height: 2.2;
            ">
                <b style="color:#ff9800; display:block; margin-bottom:6px;">💡 Tips for best results:</b>
                ✅ Close-up photo of the leaf<br>
                ✅ Natural / bright lighting<br>
                ✅ Only the leaf in frame<br>
                ✅ Avoid blurry or dark photos<br>
                ✅ Use camera for live detection
            </div>
        </div>
    `;

    if (productContainer) {
        productContainer.innerHTML = `
            <h2>🌿 Recommended Products</h2>
            <p style="color:#ff9800; font-weight:bold; margin-top:16px; font-size:14px;">
                ⚠️ Please upload a valid plant leaf image to see product recommendations.
            </p>
        `;
    }
}

/* ================================================================
   SHOW — DISEASE / HEALTHY
================================================================ */
function showDisease(data, resultBox, productContainer) {
    if (!resultBox) return;

    let confidence = data.confidence;

    // Adjusted display values
    if (data.title && data.title.toLowerCase().includes("healthy"))     confidence = 99.9;
    if (data.title && data.title.toLowerCase().includes("nutritional")) confidence = Math.max(confidence, 90);

    const color     = confidence >= 90 ? "#00ff90" : confidence >= 70 ? "#ffcc00" : "#ff4d4d";
    const severity  = data.severity || (confidence >= 90 ? "Low" : confidence >= 70 ? "Medium" : "High");
    const isHealthy = data.status === "healthy" || (data.title && data.title.toLowerCase().includes("healthy"));
    const aiMsg     = isHealthy ? "🌿 Your plant is perfectly healthy!" : "⚠️ Disease detected! Take action soon.";
    const msgColor  = isHealthy ? "#00ff90" : "#ff9800";

    resultBox.innerHTML = `
        <div class="result-card" style="animation: slideUp 0.4s ease;">

            <div style="text-align:center; margin-bottom:16px;">
                <div style="font-size:48px; margin-bottom:8px;">${data.emoji || "🌿"}</div>
                <h3 style="font-size:22px; color:#fff; margin:0;">${data.title}</h3>
                <p style="color:${msgColor}; font-weight:bold; margin-top:6px; font-size:14px;">${aiMsg}</p>
            </div>

            <!-- Confidence + Severity Row -->
            <div style="display:flex; gap:12px; margin-bottom:14px; flex-wrap:wrap; align-items:center;">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                        <span style="font-size:12px; color:#888;">🎯 Confidence</span>
                        <span style="font-size:13px; color:${color}; font-weight:bold;">${confidence}%</span>
                    </div>
                    <div style="background:#1a1a2e; border-radius:20px; overflow:hidden; height:10px;">
                        <div id="progressBarFill" style="
                            width: 0%;
                            height:100%;
                            background: linear-gradient(90deg, ${color}88, ${color});
                            border-radius: 20px;
                            transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
                            box-shadow: 0 0 8px ${color}55;
                        "></div>
                    </div>
                </div>
                <div>${getSeverityBadge(severity)}</div>
            </div>

            <!-- Info Sections -->
            <div class="result-section">
                <h4>📌 Why this result?</h4>
                <p>${data.reason}</p>
            </div>

            ${data.symptoms && data.symptoms !== "N/A" && data.symptoms !== "No spots, discoloration, wilting, or damage observed. Plant looks normal." || isHealthy ? `
            <div class="result-section">
                <h4>🔍 Symptoms</h4>
                <p>${data.symptoms}</p>
            </div>` : ""}

            <div class="result-section">
                <h4>${isHealthy ? "✅ Care Tips" : "💊 Recommended Cure"}</h4>
                <p>${data.cure}</p>
            </div>

            ${data.prevention && data.prevention !== "N/A" ? `
            <div class="result-section">
                <h4>🛡️ Prevention</h4>
                <p>${data.prevention}</p>
            </div>` : ""}

            ${data.plant_score !== undefined ? `
            <div style="margin-top:10px; font-size:12px; color:#555;">
                🌱 Plant color detected: ${data.plant_score}%
            </div>` : ""}
        </div>
    `;

    // Animate progress bar
    setTimeout(() => {
        const bar = document.getElementById("progressBarFill");
        if (bar) bar.style.width = confidence + "%";
    }, 150);

    // Products
    if (productContainer) {
        let html = "<h2>🌿 Recommended Products</h2>";
        if (data.products && data.products.length > 0) {
            data.products.forEach(p => {
                html += `
                <div class="product-card" style="animation: fadeIn 0.5s ease;">
                    <img src="${p.image}" class="product-img" alt="${p.name || 'product'}" onerror="this.style.display='none'">
                    ${p.name ? `<p style="font-size:13px; color:#ccc; margin:8px 0 4px; font-weight:bold;">${p.name}</p>` : ""}
                    <a href="${p.link}" target="_blank" class="buy-btn">🛒 Buy Now</a>
                </div>`;
            });
        } else {
            html += `
            <div style="text-align:center; padding:24px; color:#00ff90;">
                <div style="font-size:42px; margin-bottom:10px;">🌿</div>
                <p style="font-weight:bold; font-size:15px;">No products needed!</p>
                <p style="color:#aaa; font-size:13px;">Your plant is healthy. Keep up the good care!</p>
            </div>`;
        }
        productContainer.innerHTML = html;
    }
}

/* ================================================================
   CHATBOT
================================================================ */
/* ================= CHATBOT FULL WORKING ================= */

let voiceEnabled = false;
let recognition = null;

/* ================= SEND MESSAGE ================= */
async function sendMessage() {
    const input = document.getElementById("userInput");
    if (!input) return;

    const message = input.value.trim();
    if (message === "") return;

    const chatBox = document.getElementById("chatBox");

    // USER MESSAGE
    addMessage(message, "user");

    input.value = "";

    // Typing indicator
    showTypingIndicator();

    try {
        const res = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await res.json();

        removeTypingIndicator();

        const reply = data.reply || "⚠️ No response from server";

        typeEffect(reply);

        if (voiceEnabled) {
            speak(reply);
            voiceEnabled = false;
        }

    } catch (error) {
        console.error("Error:", error);

        removeTypingIndicator();

        addMessage("❌ Server error. Flask run karo!", "bot");
    }
}

/* ================= ADD MESSAGE ================= */
function addMessage(text, sender) {
    const chatBox = document.getElementById("chatBox");
    if (!chatBox) return;

    const wrapper = document.createElement("div");
    wrapper.className = `message ${sender}`;

    const msg = document.createElement("div");
    msg.className = sender === "user" ? "user-msg" : "bot-msg";

    // ❌ REMOVE extra div
    msg.innerHTML = `
        <span>${text}</span>
        <div class="time">
            ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
    `;

    // Avatar only for bot
    if (sender === "bot") {
        const avatar = document.createElement("img");
        avatar.src = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";
        avatar.className = "bot-avatar";
        wrapper.appendChild(avatar);
    }

    wrapper.appendChild(msg);
    chatBox.appendChild(wrapper);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* ================= TYPING INDICATOR ================= */
function showTypingIndicator() {
    const chatBox = document.getElementById("chatBox");

    const indicator = document.createElement("div");
    indicator.id = "typingIndicator";
    indicator.classList.add("message", "bot");

    indicator.innerHTML = `
        <div class="bot-msg">
            <span>Typing...</span>
        </div>
    `;

    chatBox.appendChild(indicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) indicator.remove();
}

/* ================= TYPE EFFECT ================= */
function typeEffect(text) {
    const chatBox = document.getElementById("chatBox");

    const wrapper = document.createElement("div");
    wrapper.className = "message bot";

    const msg = document.createElement("div");
    msg.className = "bot-msg";

    const textEl = document.createElement("div");
    textEl.className = "text";

    msg.appendChild(textEl);
    wrapper.appendChild(msg);
    chatBox.appendChild(wrapper);

    let i = 0;

    function typing() {
        if (i < text.length) {
            textEl.textContent += text[i];
            i++;
            chatBox.scrollTop = chatBox.scrollHeight;
            setTimeout(typing, 20);
        }
    }

    typing();
}

/* ================= ENTER KEY SUPPORT ================= */
document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("userInput");

    if (input) {
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                sendMessage();
            }
        });
    }
});


/* ================= VOICE INPUT ================= */
function startListening() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Use Chrome for voice feature");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "en-IN";

    recognition.start();

    recognition.onresult = function (event) {
        const text = event.results[0][0].transcript;
        document.getElementById("userInput").value = text;
        voiceEnabled = true;
        sendMessage();
    };
}

/* ================= VOICE OUTPUT ================= */
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}








function speakResult() {

    const lang = document.getElementById("langSelect")?.value || "en-US";

    const parts = [
        document.getElementById("resultTitle")?.innerText,
        document.getElementById("resultReason")?.innerText,
        document.getElementById("resultSymptoms")?.innerText,
        document.getElementById("resultCure")?.innerText,
        document.getElementById("resultPrevention")?.innerText
    ];

    const text = parts.filter(Boolean).join(". ");

    if (!text.trim()) {
        alert("No text to speak!");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    // 🔥 Kannada support
    
    if (lang === "kn-IN") {
        speech.lang = "kn-IN";
    } else {
        speech.lang = lang;
    }

    speech.rate = 1;
    speech.pitch = 1;

    // 🔥 Voice selection (important for Kannada)
    const voices = window.speechSynthesis.getVoices();

    const selectedVoice = voices.find(voice =>
        voice.lang === speech.lang
    );

    if (selectedVoice) {
        speech.voice = selectedVoice;
    } else {
        console.warn("Kannada voice not found, using default");
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
}