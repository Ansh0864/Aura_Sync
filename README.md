# AuraSync

AuraSync is an experimental biometric audio engine that synchronizes human emotion with digital acoustic environments. By utilizing a custom Convolutional Neural Network (CNN), the system analyzes facial micro-expressions in real-time and algorithmically routes your emotional state to a curated, multilingual playlist (Hindi, Punjabi, Haryanvi, and English).

## 🚀 Features

* **Neural Recognition**: Custom TensorFlow/Keras CNN trained on 7 basic emotion classes.
* **Acoustic Mapping**: Real-time routing to matching Spotify playlists based on Valence, Energy, and Tempo.
* **Multilingual Engine**: Dynamic selection of English, Bollywood, Punjabi, and Haryanvi trending tracks.
* **Local Biometrics**: 100% on-device WebRTC frame capture—no video data leaves your machine.
* **Telemetry Dashboard**: Local storage-synced analytics tracking dominant moods and scan streaks.

## 🛠️ Tech Stack

**Frontend**
* React 18
* Tailwind CSS (Dark/Neon Esports Theme)
* Framer Motion (Animations)
* React Webcam
* Axios & React Router

**Backend**
* FastAPI & Uvicorn (High-performance API)
* Python 3.x
* TensorFlow / Keras (CNN Model)
* Pillow & NumPy (Image Processing)
* Spotify API Integration

## ⚙️ Local Setup & Installation

Because this project features a React frontend and a heavy Python/AI backend, you will need to run both environments simultaneously.

### 1. Backend Setup (FastAPI & AI)
Navigate to the root directory (or your backend folder) and set up your Python environment:

\`\`\`bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\\Scripts\\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn tensorflow numpy pillow python-multipart requests
\`\`\`

*(Optional) Train the Model:*
If you haven't generated the `mood_model.h5` file yet, ensure you have your `dataset/` folder structured with `train` and `test` directories, then run:
\`\`\`bash
python train_model.py
\`\`\`

*Run the Backend Server:*
\`\`\`bash
uvicorn main:app --reload
\`\`\`
The API will start running at `http://localhost:8000`.

### 2. Frontend Setup (React)
Open a **new terminal window**, navigate to your frontend directory, and install the Node dependencies:

\`\`\`bash
# Install dependencies
npm install

# Start the development server (Assuming Vite or Create React App)
npm run dev 
# OR 
npm start
\`\`\`
The web interface will typically start at `http://localhost:5173` or `http://localhost:3000`.

## 🌐 Deployment Strategy

Due to the size of the TensorFlow machine learning model, the backend cannot be deployed on serverless platforms with strict size limits (like Vercel). 
* **Backend**: Deploy on a service like [Render](https://render.com/) or [Railway](https://railway.app/) using a Web Service setup.
* **Frontend**: Deploy seamlessly on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/). Remember to update the Axios API calls in `Scanner.jsx` to point to your live backend URL before deploying.
