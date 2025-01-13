from flask import Flask, request, jsonify
import cv2
import face_recognition
import pymongo
import requests
from io import BytesIO
from PIL import Image
import time
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)


MONGO_URI = ""
DB_NAME = ""
COLLECTION_NAME = ""

client = pymongo.MongoClient(MONGO_URI)
print("connected to database",client.list_database_names())
db = client[DB_NAME]
collection = db[COLLECTION_NAME]


face_classifier = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

@app.route('/compare-face', methods=['POST'])
def compare_face():

    data = request.json
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email not provided"}), 400
    print("Hi")
    user_document = collection.find_one({"email": email})
    if not user_document:
        return jsonify({"error": "User not found"}), 404
    print("hI")
    # Fetch Cloudinary image URL
    cloudinary_url = user_document.get("image_url")
    if not cloudinary_url:
        return jsonify({"error": "Image URL not found in the user's document"}), 404

    # Download the image from Cloudinary
    try:
        response = requests.get(cloudinary_url)
        response.raise_for_status()
        reference_image = face_recognition.load_image_file(BytesIO(response.content))
        reference_encoding = face_recognition.face_encodings(reference_image)[0]
    except Exception as e:
        return jsonify({"error": f"Failed to fetch or process the image: {str(e)}"}), 500

    # Start video capture
    video_capture = cv2.VideoCapture(0)
    start_time = time.time()
    timeout = 30  # Timeout after 30 seconds

    def detect_and_compare(frame):
        gray_image = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray_image, 1.1, 5, minSize=(40, 40))

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 4)
            face_roi = frame[y:y+h, x:x+w]
            face_rgb = cv2.cvtColor(face_roi, cv2.COLOR_BGR2RGB)
            face_encodings = face_recognition.face_encodings(face_rgb)

            if face_encodings:
                match = face_recognition.compare_faces([reference_encoding], face_encodings[0])
                if match[0]:
                    cv2.putText(frame, "Match Found", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
                    return True, frame  # Match found
        return False, frame

    while True:
        result, frame = video_capture.read()
        if not result:
            break

        is_match, processed_frame = detect_and_compare(frame)
        cv2.imshow('Video', processed_frame)

        if is_match:
            print("Match Found")
            video_capture.release()
            cv2.destroyAllWindows()
            return jsonify({"message": "Match Found"}), 200

        # Timeout check
        if time.time() - start_time > timeout:
            print("No Match Found within 30 seconds")
            video_capture.release()
            cv2.destroyAllWindows()
            return jsonify({"message": "No Match Found within 30 seconds"}), 200

        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Terminated by User")
            video_capture.release()
            cv2.destroyAllWindows()
            return jsonify({"message": "Terminated by User"}), 200

# Run Flask server
if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
