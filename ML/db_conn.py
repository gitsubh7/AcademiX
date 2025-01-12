from dotenv import load_dotenv
load_dotenv()
from pymongo import MongoClient
uri = os.getenv("MONGODB_URI")
client = MongoClient(uri)
db = client["aggregationpipelines"]
collection = db["academiX"]
