import os
import pandas as pd
from pymongo import MongoClient
import dotenv

dotenv.load_dotenv()
MONGO_URI = os.getenv('MONGO_URI')
DATABASE_NAME = os.getenv('DATABASE_NAME')
COLLECTION_NAME = os.getenv('COLLECTION_NAME')

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

# Clear existing empty documents if any
collection.delete_many({})

# Read CSV
df = pd.read_csv('ipc_sections_fixed.csv')

# Convert to dictionary and insert
data = df.to_dict('records')
collection.insert_many(data)

print(f"Imported {len(data)} records successfully")