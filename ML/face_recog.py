from flask import Flask, request, jsonify
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
from PIL import Image
from io import BytesIO
import face_recognition
import base64

app = Flask(__name__)
load_dotenv()
uri = os.getenv("MONGODB_URI")
client = MongoClient(uri)
db = client["academiX"]
collection = db["students"]

@app.route('/face_recog', methods=['POST'])
def face_recog():
    try:
        
        if 'image' not in request.files:
            return jsonify({"message": "Image file is required"}), 400

        test_image_data = request.files['image'] 
        email = request.form.get("email")  

        if not email:
            return jsonify({"message": "Email is required"}), 400


        result = collection.find_one({"email": email})
        if not result:
            return jsonify({"message": "Email not found in the database"}), 404

        image_url = result.get('image_url')

        if not image_url:
            return jsonify({"message": "No image URL found for this email"}), 400

        print(f"Processing face recognition for {email}")

        
        test_image_bytes = test_image_data.read() 
        test_img_array = face_recognition.load_image_file(BytesIO(test_image_bytes))

        try:
            test_encoding = face_recognition.face_encodings(test_img_array)
            if not test_encoding:
                return jsonify({"message": "No face detected in the test image"}), 400
            test_encoding = test_encoding[0]
        except Exception as e:
            return jsonify({"message": "Error processing test image"}), 400

        try:
            response = requests.get(image_url, stream=True)
            if response.status_code != 200:
                return jsonify({"message": "Failed to download reference image"}), 400

            image_bytes = BytesIO(response.content)
            ref_img_array = face_recognition.load_image_file(image_bytes)
        except Exception as e:
            return jsonify({"message": "Invalid reference image URL"}), 400

        try:
            ref_encoding = face_recognition.face_encodings(ref_img_array)
            if not ref_encoding:
                return jsonify({"message": "No face detected in the reference image"}), 400
            ref_encoding = ref_encoding[0]
        except Exception as e:
            return jsonify({"message": "Error processing reference image"}), 400


        match = face_recognition.compare_faces([ref_encoding], test_encoding)[0]

        if match:
            return jsonify({"message": "Face recognised"}), 200
        else:
            return jsonify({"message": "Face not recognised"}), 400

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"message": f"Internal Server Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=3000)
