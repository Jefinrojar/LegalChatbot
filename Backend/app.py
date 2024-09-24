import pandas as pd
import numpy as np
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize
from googletrans import Translator  # Import googletrans

app = Flask(__name__)
CORS(app)

# Load the sentence transformer model
model = SentenceTransformer('sentence-transformers/paraphrase-mpnet-base-v2')

# Load the CSV data
df = pd.read_csv('ipc_sections1.csv')
legal_data = df.to_dict(orient='records')

# Compute the embeddings for the legal document titles
legal_embeddings = [
    model.encode(str(doc['title'])) for doc in legal_data if isinstance(doc['title'], (str, bytes))
]
embeddings_matrix = normalize(np.array(legal_embeddings), axis=1)

# Initialize FAISS index for similarity search
index = faiss.IndexFlatIP(embeddings_matrix.shape[1])
index.add(embeddings_matrix)

# Initialize the Googletrans Translator
translator = Translator()

def find_similar_documents(query, top_k=5):
    """Finds the top-k similar documents for a given query."""
    query_embedding = model.encode([query])
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
