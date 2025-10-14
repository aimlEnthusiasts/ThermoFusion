#!/usr/bin/env bash

# Ensure we use python3
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Start FastAPI using uvicorn
uvicorn main:app --host 0.0.0.0 --port $PORT
