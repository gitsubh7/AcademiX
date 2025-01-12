from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import os 
from PIL import Image
from io import BytesIO
port = 5000



from pymongo import MongoClient


uri = "mongodb+srv://subhaann77:<db_pass>@aggregationpipelines.1v1pq.mongodb.net/"

client = MongoClient(uri)
db = client["aggregationpipelines"]
collection = db["academiX"]



app=Flask(__name__)
if __name__=="__main__":
    app.run(host='0.0.0.0',port=port)

client.close()



