# 🌿 PlantCare AI - Smart Plant Disease Detector

Hello
Ye ek AI-based project hai jo plant ke leaves ki image dekh ke disease identify karta hai aur uska solution bhi batata hai.

Simple language me 
 Image upload karo → 🤖 AI analyze karega →  Disease + Cure bata dega

---

##  Kya kya kar sakta hai ye project?

*  Plant disease detect karta hai (Healthy, Nutritional, Powdery, Rust)
*  Image upload ya camera se capture
*  Accuracy ke sath prediction
*  Disease ka reason + cure batata hai
*  Related products bhi suggest karta hai
*  Smart chatbot (Hindi + English + Hinglish)

---

##  Kaise kaam karta hai?

* CNN (Deep Learning model) use kiya hai
* Model images ko analyze karta hai
* Backend Flask pe run ho raha hai
* Frontend HTML + CSS + JS

---

##  Project Structure (simple samjho)

```
plant-ai/
│
├── app.py              → main backend (Flask server)
├── model.h5            → trained AI model
├── requirements.txt    → required libraries
├── Procfile            → deployment ke liye
│
├── templates/
│   └── index.html      → UI (frontend)
│
├── static/
│   ├── css/            → styling
│   ├── js/             → logic
│   ├── images/         → images
│
├── dataset/            → training data (GitHub pe upload nahi karna)
├── train_model.py      → model training code
├── predict.py          → prediction logic
```

---

##  Local me kaise run kare?

### Step 1:

```bash
pip install -r requirements.txt
```

### Step 2:

```bash
python app.py
```

### Step 3:

Browser me open karo:

```
http://127.0.0.1:5000
```

---

##  Online (Mobile pe use karne ke liye)

1. GitHub pe project upload karo
2. Render pe deploy karo
3. Tumhe ek link milega (jaise):

```
https://your-app.onrender.com
```

 Is link ko mobile me open karo
 Add to Home Screen = app jaisa feel 😎

---

##  Mobile App banana (optional)

Agar tum chaho to isko Android app bhi bana sakte ho using WebView.

---

##  Important Notes

* Dataset GitHub pe upload mat karna (heavy hota hai)
* Model file (`model.h5`) zaroor upload karo
* Agar TensorFlow error aaye to `tensorflow-cpu` use karo

---

##  Developer

Made with ❤️ by **Saqeeb**

---

##  Future Improvements

* More diseases add karna
* Accuracy improve karna
* Real-time camera detection
* Full mobile app banana

---
---

## 📸 Screenshots

### 🏠 Home Page
![PlantCare AI Home Page](Screenshot%202026-10-29%20051557.png)

### 🔍 Disease Diagnosis Result
![PlantCare AI Diagnosis Result](Screenshot%202026-10-29%20051643.png)
