import os
from dotenv import load_dotenv

# Load environment variables from api.env file
load_dotenv(dotenv_path='api.env')

import google.generativeai as genai
import pyttsx3
import speech_recognition as sr
from flask import Flask, request, jsonify
from flask_cors import CORS

# Set the environment variable for Google Cloud authentication
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Initialize Google Generative AI with your API key
genai.configure(api_key=os.getenv('API_KEY'))

'''
import os
import google.generativeai as genai
import pyttsx3
import speech_recognition as sr
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

# Set the environment variable for Google Cloud authentication
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'path_to_your_google_cloud_vision_key.json'

# Initialize Google Generative AI with your API key
genai.configure(api_key="AIzaSyCqthlU3NNsCVsnvKSngMDqq-AupifVyWI")
'''
# Define the character descriptions
character_descriptions = {
    'muscle-mike': "A fitness enthusiast with a tough, but friendly attitude.",
    'melody-mimi': "A music lover with a creative and artistic spirit.",
    'van-gogh-vinny': "An artist with a passion for painting and deep philosophy.",
    'sonnet-sammy': "A poetic soul who loves to write and talk about deep emotions.",
    'corporate-charlie': "A professional business person, always focused on success and productivity.",
    'entrepreneur-ella': "A go-getter who loves to build new businesses and innovate.",
    'chef-chow': "A master of the culinary arts, passionate about food and cooking.",
    'lounging-larry': "A laid-back, easy-going individual who loves to relax and enjoy life."
}

app = Flask(__name__)

# Enable CORS for all routes in your app
CORS(app)

# Function to recognize speech and convert to text
def voice_to_text():
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source, duration=3)
        audio = recognizer.listen(source)

        try:
            text = recognizer.recognize_google(audio)
            return text
        except sr.UnknownValueError:
            return "Sorry, I couldn't understand that."
        except sr.RequestError:
            return "There was an issue with the speech recognition service."

# Function to generate response from the selected character
def generate_response(character, user_input):
    character_description = character_descriptions.get(character, "A unique individual with a distinct personality.")
    prompt = f"Act like {character} ({character_description}) and respond to the following input: {user_input}"
    
    model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest")
    response = model.generate_content([prompt])
    
    # Limit the response to 300 words
    response_text = response.text
    word_limit = 140
    response_words = response_text.split(' ')
    limited_response = ' '.join(response_words[:word_limit]) + ('...' if len(response_words) > word_limit else '')

    return limited_response

@app.route('/')
def index():
    return 'Backend is up and running!'

# Route to handle text input and generate AI response
@app.route('/generate_response', methods=['POST'])
def generate_response_route():
    data = request.json
    character = data.get('character')
    user_input = data.get('user_input')
    
    if not character or not user_input:
        return jsonify({"error": "Missing character or user input"}), 400
    
    # Generate the response based on the character and user input
    response_text = generate_response(character, user_input)
    
    return jsonify({"response": response_text})

# Route to handle speech input
@app.route('/speech_to_text', methods=['GET'])
def speech_to_text_route():
    # This could be triggered on the frontend (or call this from an Ajax request)
    user_input = voice_to_text()
    
    return jsonify({"user_input": user_input})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5506)  # Example: port 5502
