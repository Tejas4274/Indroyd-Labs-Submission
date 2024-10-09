# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!



# Quiz Application Backend

This project is built using Node.js, Express, and Socket.IO to create a real-time quiz application backend.

# Getting Started:

# Prerequisites
## Node.js (v12 or higher)
## npm (Node package manager)

# Installation
Set Up Your Backend:

## Create a new directory for your backend code.
## Inside that directory, create a file named index.js and copy your backend code into it.
## Install Dependencies: 
Open a terminal in the backend directory and run:

### 'npm install express socket.io qrcode cors'

# Running the Server:
### node index.js
Runs the server in development mode.

# Open http://localhost:3001 to connect with the frontend application.

# API Endpoints:
GET /qrcode: Generates a QR code that players can scan to join the quiz on their mobile devices.

# Socket Events:
connection: Triggered when a player connects to the server.

answer: Receives the player's answer and checks if it is correct.
question: Sends the current question to the players.

result: Sends feedback about the player's answer.
quizEnded: Notifies players when the quiz has ended.

# Testing the Application
For testing the real-time functionality, you can connect multiple clients through the frontend application.

# License
This project is licensed under the MIT License.

# Learn More
You can learn more about the technologies used:

Node.js
Express
Socket.IO
QRCode

# Contributing
Feel free to contribute to this project!