import pandas as pd
import numpy as np
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize
from googletrans import Translator  # Using googletrans for synchronous translation
import os
import pickle
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
import chardet
from dotenv import load_dotenv
# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the sentence transformer model
model = SentenceTransformer('sentence-transformers/paraphrase-mpnet-base-v2')

# MongoDB configuration for user authentication
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
USERS_COLLECTION_NAME = os.getenv('USERS_COLLECTION_NAME')

# Initialize MongoDB client and access collection for user authentication
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
users_collection = db[USERS_COLLECTION_NAME]

if not MONGO_URI or not DATABASE_NAME or not USERS_COLLECTION_NAME:
    raise ValueError("Environment variables are not set properly.")
# Path to the CSV file containing legal data
CSV_PATH = 'ipc_sections.csv'

# Function to detect file encoding
def detect_encoding(file_path):
    """Detect the encoding of a file."""
    with open(file_path, 'rb') as f:
        result = chardet.detect(f.read())
    return result['encoding']

# Function to clean corrupted text
def clean_text(text):
    """Replace corrupted characters with their correct equivalents."""
    replacements = {
        'â€œ': '“',  # Left curly quote
        'â€': '”',  # Right curly quote
        'â€': '—',   # Em dash
        # Add more replacements as needed
    }
    if isinstance(text, str):
        for corrupted, correct in replacements.items():
            text = text.replace(corrupted, correct)
    return text

# Function to load legal data from CSV
def load_legal_data_from_csv():
    """Load legal data from a CSV file."""
    try:
        # Read the file in binary mode and decode it manually
        with open(CSV_PATH, 'rb') as f:
            content = f.read().decode('utf-8', errors='replace')
        
        # Use pandas to read the cleaned content
        from io import StringIO
        df = pd.read_csv(StringIO(content))

        # Clean corrupted characters in text columns
        for column in df.columns:
            if df[column].dtype == object:  # Check if the column contains text
                df[column] = df[column].apply(clean_text)

        # Handle null or missing data
        df = df.fillna('')  # Replace null values with empty strings

        legal_data = df.to_dict('records')  # Convert DataFrame to a list of dictionaries
        return legal_data
    except Exception as e:
        raise ValueError(f"Unable to read the CSV file: {e}")

# Fetch legal data from the CSV file
legal_data = load_legal_data_from_csv()
# Path to save or load embeddings
EMBEDDINGS_PATH = 'legal_embeddings.pkl'

# Function to load or create embeddings
def load_or_create_embeddings():
    """Load precomputed embeddings from disk or create them if they don't exist."""
    if os.path.exists(EMBEDDINGS_PATH):
        # Load cached embeddings
        with open(EMBEDDINGS_PATH, 'rb') as f:
            embeddings_matrix = pickle.load(f)
    else:
        # Compute embeddings in batches and normalize
        print("Computing embeddings...")
        # Combine 'Section', 'Section Title', and 'Section Description' for embedding
        combined_texts = [f"{doc['Section']} {doc['Section Title']} {doc['Section Description']}" for doc in legal_data]
        legal_embeddings = model.encode(combined_texts, batch_size=16, convert_to_numpy=True)
        embeddings_matrix = normalize(np.array(legal_embeddings), axis=1)
        
        # Save embeddings to file for future use
        with open(EMBEDDINGS_PATH, 'wb') as f:
            pickle.dump(embeddings_matrix, f)
    
    return embeddings_matrix

# Load or compute embeddings and initialize FAISS index
embeddings_matrix = load_or_create_embeddings()
index = faiss.IndexFlatIP(embeddings_matrix.shape[1])
index.add(embeddings_matrix)

# Initialize the googletrans Translator
translator = Translator()

# Function to find similar documents
def find_similar_documents(query, top_k=5):
    """Finds the top-k similar documents for a given query."""
    query_embedding = model.encode([query], convert_to_numpy=True)
    query_embedding = normalize(np.array(query_embedding), axis=1)
    D, I = index.search(query_embedding, top_k)
    return I, D

# Sign Up endpoint
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    user_name = data.get('user_name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    # Check for required fields
    if not all([user_name, email, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400

    # Check if the passwords match
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Check if the email is already in use
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    # Hash the password for security
    hashed_password = generate_password_hash(password)

    # Insert the user into the MongoDB collection
    user_id = users_collection.insert_one({
        "user_name": user_name,
        "email": email,
        "password": hashed_password
    }).inserted_id

    return jsonify({"message": "User created", "user_id": str(user_id)}), 201

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')  # Use .get() to avoid KeyError if key is missing
    password = data.get('password')

    # Check for required fields
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find the user in the MongoDB collection
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "Invalid email or password"}), 400

    # Check if the password matches the stored hashed password
    if check_password_hash(user['password'], password):
        return jsonify({
            "message": "Login successful",
            "user_id": str(user['_id']),
            "username": user['user_name'],  # Add username to the response
            "email": user['email']
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 400

# Chat endpoint with synchronous translation
@app.route('/chat', methods=['POST'])
def chat():
    """Handles chat requests and returns the most relevant legal document."""
    user_query_tamil = request.json.get('message')

    try:
        # Translate Tamil input to English for processing
        user_query_english = translator.translate(user_query_tamil, dest='en').text
        
        # Find similar documents using the English query
        I, D = find_similar_documents(user_query_english, top_k=5)
        
        # Retrieve the most relevant document
        relevant_doc = legal_data[I[0][0]]

        # Translate the response fields to Tamil
        translated_section = translator.translate(relevant_doc['Section'], dest='ta').text
        translated_title = translator.translate(relevant_doc['Section Title'], dest='ta').text
        translated_description = translator.translate(relevant_doc['Section Description'], dest='ta').text
        translated_punishments = translator.translate(relevant_doc['Punishments'], dest='ta').text

        response = {
            "section": translated_section,
            "section_title": translated_title,
            "section_description": translated_description,
            "punishments": translated_punishments
        }

        return jsonify(response)
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
