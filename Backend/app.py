import pandas as pd
import numpy as np
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer


app = Flask(__name__)
CORS(app)

model = SentenceTransformer('sentence-transformers/paraphrase-mpnet-base-v2')

df = pd.read_csv('ipc_sections_cleaned.csv')

legal_data = df.to_dict(orient='records')

legal_embeddings = [model.encode(doc['content']) for doc in legal_data]

embeddings_matrix = np.array(legal_embeddings)

index = faiss.IndexFlatL2(embeddings_matrix.shape[1])
index.add(embeddings_matrix)



def find_similar_documents(query, top_k=1):
    query_embedding = model.encode([query])
    D, I = index.search(np.array(query_embedding), top_k)
    return I, D

@app.route('/chat', methods=['POST'])
def chat():

    user_query = request.json.get('message')

    I, D = find_similar_documents(user_query)

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
