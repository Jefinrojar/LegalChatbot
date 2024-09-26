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

app = Flask(__name__)
CORS(app)

# Load the sentence transformer model
model = SentenceTransformer('sentence-transformers/paraphrase-mpnet-base-v2')

# File paths
DATA_PATH = 'ipc_sections1.csv'
EMBEDDINGS_PATH = 'legal_embeddings.pkl'

# Load the CSV data
df = pd.read_csv(DATA_PATH)
legal_data = df.to_dict(orient='records')

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
