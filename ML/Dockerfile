FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install only what's needed for lightweight builds
RUN apt-get update && \
    apt-get install -y libglib2.0-0 libsm6 libxrender1 libxext6 && \
    rm -rf /var/lib/apt/lists/*

# Copy only requirements first
COPY requirements.txt .

# Replace opencv-python with opencv-python-headless in requirements.txt BEFORE THIS STEP
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the app
COPY . .

# Expose the app port
EXPOSE 8000

# Run the app
CMD ["gunicorn", "-b", "0.0.0.0:8000", "face_recog:app"]
