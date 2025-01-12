from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os 
from PIL import Image
from io import BytesIO
port = os.getenv("PORT") | 5000
from dotenv import load_dotenv
load_dotenv()
import face_recognition



















app=Flask(__name__)
if __name__=="__main__":
    app.run(host='0.0.0.0',port=port)





