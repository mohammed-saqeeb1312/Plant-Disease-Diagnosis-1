# 🌿 PlantCare AI – Smart Plant Disease Detection System

An AI-powered plant disease diagnosis system designed to help users identify plant leaf diseases and receive practical treatment recommendations.

PlantCare AI uses Deep Learning to analyze leaf images, identify potential diseases, and provide useful information about their causes, symptoms, and possible treatments.

**How it works:**

Upload an image → AI analyzes the leaf → Detects the disease → Provides diagnosis and treatment recommendations.

---

## 🚀 Key Features

- **AI-Based Disease Detection:** Identifies plant conditions such as Healthy, Nutritional Deficiency, Powdery Mildew, and Rust.
- **Image Upload:** Upload plant leaf images directly from your device.
- **Camera Capture:** Capture images using your device's camera for instant analysis.
- **Deep Learning Predictions:** Uses a trained CNN model to classify plant leaf conditions.
- **Disease Information:** Provides details about disease causes, symptoms, and possible treatments.
- **Product Recommendations:** Suggests relevant agricultural products, including fertilizers and fungicides.
- **AI Chatbot:** An interactive chatbot supporting English, Hindi, and Hinglish.
- **Responsive Interface:** Designed to work across desktop and mobile devices.

---

## ⚙️ Technologies Used

| Technology | Purpose |
|---|---|
| Python | Backend development |
| TensorFlow / Keras | Deep Learning model |
| CNN | Image classification |
| Flask | Web application backend |
| HTML5 | Frontend structure |
| CSS3 | User interface styling |
| JavaScript | Frontend interactions |

---

## 🧠 How Does It Work?

PlantCare AI follows a Deep Learning-based image classification approach.

1. The user uploads a plant leaf image or captures one using the camera.
2. The image is preprocessed and resized before analysis.
3. The trained CNN model analyzes the image.
4. The model predicts the corresponding plant condition.
5. The system displays the prediction and confidence score.
6. Relevant disease information and treatment recommendations are provided.

---

## 📂 Project Structure

```text
plant-ai/
│
├── app.py                  # Main Flask application
├── model.h5                # Trained deep learning model
├── requirements.txt        # Python dependencies
├── Procfile                # Deployment configuration
│
├── templates/
│   └── index.html          # Main frontend page
│
├── static/
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   └── images/             # Static images and assets
│
├── dataset/                # Training dataset (not uploaded)
├── train_model.py          # Model training script
├── predict.py              # Prediction logic
│
└── README.md               # Project documentation
```

---

## 💻 Installation and Local Setup

Follow these steps to run PlantCare AI on your local machine.

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Navigate to the Project Directory

```bash
cd plant-ai
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Run the Application

```bash
python app.py
```

### Step 5: Open in Your Browser

```text
http://127.0.0.1:5000
```

The application should now be accessible locally.

---

## ☁️ Deployment

PlantCare AI can be deployed online using platforms such as Render.

**Deployment Workflow:**

1. Upload the project source code to GitHub.
2. Connect your GitHub repository to Render.
3. Configure the required build and start commands.
4. Add the necessary environment variables and dependencies.
5. Deploy the application.
6. Access your application through the generated public URL.

Example:

```text
https://your-app.onrender.com
```

The deployed application can be accessed from desktop and mobile browsers.

---

## 📱 Mobile Compatibility

PlantCare AI is designed to support mobile devices.

Users can:
- Upload images directly from their phones.
- Capture plant leaf images using their mobile cameras.
- Access disease diagnosis and recommendations.
- Add the website to their home screen for an app-like experience.

An Android application can also be developed in the future using WebView technology.

---

## 📌 Important Notes

- The training dataset should not be uploaded to GitHub because of its potentially large size.
- The trained model file (`model.h5`) must be available for prediction.
- Ensure that the TensorFlow version is compatible with the installed Python environment.
- `tensorflow-cpu` can be used in environments where GPU support is unavailable.
- Configure all required file paths and deployment settings before running the application.

---

## 🔮 Future Enhancements

- Expand the system to support additional plant diseases.
- Improve model performance and prediction reliability.
- Introduce real-time plant disease detection.
- Support additional regional languages.
- Develop a dedicated Android application.
- Integrate more agricultural resources and treatment recommendations.

---

## 👨‍💻 Developer

**Mohammed Saqeeb**

*PlantCare AI – Using Artificial Intelligence to Support Smarter Plant Health Diagnosis.*

---

⭐ If you find this project useful, consider giving the repository a star!

## 📸 Screenshots

### 🏠 Home Page
![PlantCare AI Home Page](Screenshot%202026-10-29%20051557.png)

### 🔍 Disease Diagnosis Result
![PlantCare AI Diagnosis Result](Screenshot%202026-10-29%20051643.png)
