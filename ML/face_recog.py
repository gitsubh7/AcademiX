from flask import Flask, request, jsonify
# import pymongo
import os
from pymongo import MongoClient
from dotenv import load_dotenv
# import cv2
import requests
import wget
from PIL import Image
from io import BytesIO
app = Flask(__name__)


load_dotenv()
uri = os.getenv("MONGODB_URI")  
print(uri)
# Connect to MongoDB
client = MongoClient(uri)
db = client["academiX"] 
collection = db["students"]

@app.route('/face_recog', methods=['POST'])
def face_recog():
    data = request.get_json()
    
    email = data.get("email")  # Using .get() to avoid KeyError
    print(email)
    if not email:
        return jsonify({"message": "Email is required"}), 400

    result = collection.find_one({"email": email})
    image_url = result['image_url']
    print(image_url)
    # get image from this url 
    wget.download(image_url, "image.jpg")
    

    if not result:
        return jsonify({"message": "Email not found in the database"}), 404

    # Convert ObjectId to string
    result['_id'] = str(result['_id'])  

    return jsonify(result), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
