import pandas as pd
import numpy as np
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize


app = Flask(__name__)
CORS(app)

# Load pre-trained sentence-transformer model
model = SentenceTransformer('sentence-transformers/paraphrase-mpnet-base-v2')

# Load legal data
df = pd.read_csv('ipc_sections_cleaned.csv')
legal_data = df.to_dict(orient='records')

# Compute and normalize embeddings
import pandas as pd
import numpy as np
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
from sklearn.preprocessing import normalize


app = Flask(__name__)
CORS(app)

# Load pre-trained sentence-transformer model
model = SentenceTransformer('sentence-transformers/paraphrase-mpnet-base-v2')

# Load legal data
df = pd.read_csv('ipc_sections1.csv')
legal_data = df.to_dict(orient='records')

# Compute and normalize embeddings
legal_embeddings = [
    model.encode(str(doc['title'])) for doc in legal_data if isinstance(doc['title'], (str, bytes))
]
embeddings_matrix = normalize(np.array(legal_embeddings), axis=1)

# Create FAISS index for cosine similarity
index = faiss.IndexFlatIP(embeddings_matrix.shape[1])  # Use Inner Product (equivalent to cosine similarity for normalized vectors)
index.add(embeddings_matrix)

def find_similar_documents(query, top_k=5):
    # Encode and normalize query embedding
    query_embedding = model.encode([query])
    query_embedding = normalize(np.array(query_embedding), axis=1)

    # Search for top-k similar documents
    D, I = index.search(query_embedding, top_k)
    
    return I, D

@app.route('/chat', methods=['POST'])
def chat():
    # Get user query
    user_query = request.json.get('message')

    # Find top-k similar documents
    I, D = find_similar_documents(user_query, top_k=5)

    # Select the most relevant document based on highest score
    relevant_doc = legal_data[I[0][0]]

    response = {
        "title": relevant_doc['title'],
        "section": relevant_doc['section'],
        "content": relevant_doc['content'],
        "punishment": relevant_doc.get('punishment', 'No punishment available')
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)

embeddings_matrix = normalize(np.array(legal_embeddings), axis=1)

# Create FAISS index for cosine similarity
index = faiss.IndexFlatIP(embeddings_matrix.shape[1])  # Use Inner Product (equivalent to cosine similarity for normalized vectors)
index.add(embeddings_matrix)

def find_similar_documents(query, top_k=5):
    # Encode and normalize query embedding
    query_embedding = model.encode([query])
    query_embedding = normalize(np.array(query_embedding), axis=1)

    # Search for top-k similar documents
    D, I = index.search(query_embedding, top_k)
    
    return I, D

@app.route('/chat', methods=['POST'])
def chat():
    # Get user query
    user_query = request.json.get('message')

    # Find top-k similar documents
    I, D = find_similar_documents(user_query, top_k=5)

    # Select the most relevant document based on highest score
    relevant_doc = legal_data[I[0][0]]

    response = {
        "title": relevant_doc['title'],
        "section": relevant_doc['section'],
        "content": relevant_doc['content'],
        "punishment": relevant_doc.get('punishment', 'No punishment available')
    }

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
