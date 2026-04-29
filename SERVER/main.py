import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io
import requests
import base64
import time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


SPOTIFY_CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
SPOTIFY_CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")


try:
    model = load_model('mood_model.h5')
except:
    model = None # Fallback if model isn't trained yet
    
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

# In-memory database for additional backend feature (History sync)
server_history = []

def get_spotify_token():
    if not SPOTIFY_CLIENT_ID or not SPOTIFY_CLIENT_SECRET:
        print("Missing Spotify Credentials in .env file")
        return None
        
    auth_string = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    auth_base64 = str(base64.b64encode(auth_string.encode("utf-8")), "utf-8")
    url = "https://accounts.spotify.com/api/token" # Updated to the correct Spotify token URL
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    try:
        result = requests.post(url, headers=headers, data=data)
        if result.status_code != 200: return None
        return result.json().get("access_token")
    except Exception:
        return None

def get_desi_trending_tracks(emotion, token):
    if not token: return []
    # Multilingual search queries
    search_queries = {
        'Happy': 'Bhangra party Haryanvi pop English dance upbeat',
        'Sad': 'Arijit Singh sad Punjabi melancholy English acoustic',
        'Angry': 'Sidhu Moose Wala aggressive Haryanvi rap English metal',
        'Fear': 'Hindi horror mysterious English dark ambient Punjabi',
        'Surprise': 'Trending Punjabi viral English pop Haryanvi',
        'Disgust': 'Desi Hip Hop Hindi Punjabi drill English grunge',
        'Neutral': 'Lofi Bollywood chill English indie soft acoustic'
    }
    query = search_queries.get(emotion, 'Bollywood trending')
    url = "https://api.spotify.com/v1/search" # Updated to correct Spotify Search API
    headers = {"Authorization": f"Bearer {token}"}
    params = {"q": query, "type": "track", "limit": 20}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        tracks = []
        if 'tracks' in data and 'items' in data['tracks']:
            for item in data['tracks']['items']:
                tracks.append({
                    "id": item['id'], 
                    "name": item['name'],
                    "artist": item['artists'][0]['name'],
                    "image": item['album']['images'][0]['url'] if item['album']['images'] else "",
                    "url": item['external_urls']['spotify']
                })
        return tracks
    except Exception as e:
        return []

@app.post("/predict-mood/")
async def predict_mood(file: UploadFile = File(...)):
    try:
        if not model: return {"emotion": "Neutral", "songs": [], "note": "Model not loaded"}
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('L').resize((48, 48))
        img_array = np.expand_dims(np.expand_dims(np.array(image) / 255.0, axis=0), axis=-1)

        predictions = model.predict(img_array)
        predicted_emotion = emotion_labels[np.argmax(predictions[0])]
        
        token = get_spotify_token()
        songs = get_desi_trending_tracks(predicted_emotion, token) if token else []

        # Save to server history
        server_history.append({"emotion": predicted_emotion, "timestamp": time.time()})

        return {"emotion": predicted_emotion, "songs": songs}
    except Exception as e:
        return {"emotion": "Error", "details": str(e), "songs": []}

@app.get("/api/history")
def get_history():
    return {"history": server_history}