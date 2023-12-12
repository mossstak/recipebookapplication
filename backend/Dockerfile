# Use the official Python base image
FROM python:3.12.0

# Set the working directory in the container to /app
WORKDIR /app

# Install the Python dependencies from requirements.txt
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY ./app .

# Command to run the Uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "15400"]
