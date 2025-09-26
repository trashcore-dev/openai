#!/bin/bash

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Install dependencies
echo "Installing dependencies..."
npm install

# Install nodemon globally if not installed
if ! command -v nodemon &> /dev/null
then
    echo "Installing nodemon globally..."
    npm install -g nodemon
fi

# Start server with nodemon for auto-reload
echo "Starting Trashcore AI server..."
nodemon index.js
