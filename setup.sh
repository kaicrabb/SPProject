#!/bin/bash

# Backend setup
echo "Setting up backend..."
cd backend || { echo "Backend directory not found!"; exit 1; }
npm install mongoose bcryptjs cors jsonwebtoken dayjs

# Start backend
echo "Starting backend..."
npm run dev &

# Frontend setup
echo "Setting up frontend..."
cd ../frontend || { echo "Frontend directory not found!"; exit 1; }
npm install react-router react-router-dom

# Start frontend
echo "Starting frontend..."
npm start
