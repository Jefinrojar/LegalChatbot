import pandas as pd
import numpy as np
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize
from googletrans import Translator
import os
import pickle
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Load the sentence transformer model
model = SentenceTransformer('sentence-transformers/paraphrase-mpnet-base-v2')

# MongoDB configuration
MONGO_URI = 'mongodb+srv://chatbot:chatbot123@cluster0.i1lqs.mongodb.net/'
  # Update with your MongoDB URI if hosted elsewhere
DATABASE_NAME = 'chatbot'  # Name of your database
COLLECTION_NAME = 'datasets'  # Name of your collection

# Initialize MongoDB client and access collection
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
legal_collection = db[COLLECTION_NAME]

EMBEDDINGS_PATH = 'legal_embeddings.pkl' 
def load_legal_data_from_db():
    """Fetch legal data from MongoDB."""
    legal_data = list(legal_collection.find({}, {'_id': 0}))  # Retrieve all documents and exclude the '_id' field
    return legal_data

# Fetch legal data from the database
legal_data = load_legal_data_from_db()

def load_or_create_embeddings():
    """Load precomputed embeddings from disk or create them if they don't exist."""
    if os.path.exists(EMBEDDINGS_PATH):
        # Load cached embeddings
        with open(EMBEDDINGS_PATH, 'rb') as f:
            embeddings_matrix = pickle.load(f)
    else:
        # Compute embeddings in batches and normalize
        print("Computing embeddings...")
        legal_embeddings = model.encode([str(doc['title']) for doc in legal_data if isinstance(doc['title'], (str, bytes))], batch_size=16, convert_to_numpy=True)
        embeddings_matrix = normalize(np.array(legal_embeddings), axis=1)
        
        # Save embeddings to file for future use
        with open(EMBEDDINGS_PATH, 'wb') as f:
            pickle.dump(embeddings_matrix, f)
    
    return embeddings_matrix

# Load or compute embeddings and initialize FAISS index
embeddings_matrix = load_or_create_embeddings()
index = faiss.IndexFlatIP(embeddings_matrix.shape[1])
index.add(embeddings_matrix)

# Initialize the Googletrans Translator
translator = Translator()

def find_similar_documents(query, top_k=5):
    """Finds the top-k similar documents for a given query."""
    query_embedding = model.encode([query], convert_to_numpy=True)
    query_embedding = normalize(np.array(query_embedding), axis=1)
    D, I = index.search(query_embedding, top_k)
    
    return I, D

# Sign Up
users_collection = db['users']

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


#Login 
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    # Find the user in the MongoDB collection
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "Invalid email or password"}), 400

    # Check if the password matches the stored hashed password
    if check_password_hash(user['password'], password):
        return jsonify({"message": "Login successful", "user_id": str(user['_id'])}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 400


@app.route('/chat', methods=['POST'])
def chat():
    """Handles chat requests and returns the most relevant legal document."""
    user_query_tamil = request.json.get('message')

    # Translate Tamil input to English for processing
    user_query_english = translator.translate(user_query_tamil, dest='en').text
    
    # Find similar documents using the English query
    I, D = find_similar_documents(user_query_english, top_k=5)
    
    # Retrieve the most relevant document
    relevant_doc = legal_data[I[0][0]]

    # Translate the response fields to Tamil
    translated_title = translator.translate(relevant_doc['title'], dest='ta').text
    translated_section = translator.translate(relevant_doc['section'], dest='ta').text
    translated_content = translator.translate(relevant_doc['content'], dest='ta').text
    translated_punishment = translator.translate(relevant_doc.get('punishment', 'No punishment available'), dest='ta').text

    response = {
        "title": translated_title,
        "section": translated_section,
        "content": translated_content,
        "punishment": translated_punishment
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)