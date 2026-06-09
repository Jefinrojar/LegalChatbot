import pandas as pd
from pymongo import MongoClient

MONGO_URI = 'mongodb://sanjay:Sanjay@ac-bciabyw-shard-00-00.v6nvgov.mongodb.net:27017,ac-bciabyw-shard-00-01.v6nvgov.mongodb.net:27017,ac-bciabyw-shard-00-02.v6nvgov.mongodb.net:27017/?ssl=true&replicaSet=atlas-z0falg-shard-0&authSource=admin&appName=Cluster0'  # paste your new URI

client = MongoClient(MONGO_URI)
db = client['chatbot']
collection = db['datasets']

# Clear existing empty documents if any
collection.delete_many({})

# Read CSV
df = pd.read_csv('ipc_sections_fixed.csv')

# Convert to dictionary and insert
data = df.to_dict('records')
collection.insert_many(data)

print(f"Imported {len(data)} records successfully")