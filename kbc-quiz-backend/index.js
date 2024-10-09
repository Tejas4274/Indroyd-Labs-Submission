const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const QRCode = require('qrcode');
const cors = require('cors'); 

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.static('public'));

const questions = [
    { question: "What does HTML stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "HyperText Markup Level", "None of the above"], correct: 0 },
    { question: "Which language is primarily used for web development?", options: ["Python", "Java", "JavaScript", "C++"], correct: 2 },
    { question: "What is the output of 2 + '2' in JavaScript?", options: ["4", "22", "NaN", "undefined"], correct: 1 },
    { question: "Which of the following is not a programming language?", options: ["Python", "Java", "HTML", "Ruby"], correct: 2 },
    { question: "What is the purpose of a CSS selector?", options: ["To select elements for styling", "To create variables", "To define functions", "To manage data"], correct: 0 }
];


let currentQuestion = 0;

app.get('/qrcode', (req, res) => {
    const url = 'http://<Your IP Address>:3000'; 
    QRCode.toDataURL(url, (err, src) => {
        if (err) res.send("Error occurred");
        res.json({ src });
    });
});

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('question', questions[currentQuestion]);

    socket.on('answer', ({ playerName, answer }) => {
        const correctAnswer = questions[currentQuestion].correct;
        if (answer === correctAnswer) {
            io.emit('result', { message: `Congratulations ${playerName}!`, correct: true });
            currentQuestion++;

            if (currentQuestion >= questions.length) {
                io.emit('quizEnded');
            } else {
                io.emit('question', questions[currentQuestion]); 
            }
        } else {
            socket.emit('result', { message: "Incorrect answer. Try again!", correct: false });
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
