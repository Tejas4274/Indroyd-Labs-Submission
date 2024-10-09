import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import "./App.css";

const socket = io("http://192.168.43.193:3001");

function App() {
  const [playerName, setPlayerName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [question, setQuestion] = useState({ question: "", options: [] });
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [loadingQrCode, setLoadingQrCode] = useState(true);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false); 
  const [finalMessage, setFinalMessage] = useState(""); 

  useEffect(() => {
    axios
      .get("http://localhost:3001/qrcode")
      .then((res) => {
        setQrCode(res.data.src);
        setLoadingQrCode(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingQrCode(false);
      });

    socket.on("question", (newQuestion) => {
      setQuestion(newQuestion);
      setResult("");
      setSelectedOption(null);
      setIsCorrectAnswer(false);
      setQuizEnded(false); 
      setFinalMessage(""); 
    });

    socket.on("result", (resultData) => {
      setResult(resultData.message);
      if (resultData.correct) {
        setIsCorrectAnswer(true);
      }
    });

    socket.on("quizEnded", () => {
      setQuizEnded(true); 
      setFinalMessage(`Quiz has ended! Thank you for playing, ${playerName}.`); 
    });

    return () => {
      socket.off("question");
      socket.off("result");
      socket.off("quizEnded");
    };
  }, [playerName]); 

  const submitAnswer = () => {
    if (selectedOption !== null) {
      socket.emit("answer", { playerName, answer: selectedOption });
    }
  };

  const handleRegistration = () => {
    if (playerName.trim()) {
      setRegistered(true);
    } else {
      alert("Please enter a valid name.");
    }
  };

  const handleRestart = () => {
    setRegistered(false);
    setPlayerName("");
    setResult("");
    setSelectedOption(null);
    setQuizEnded(false);
    setQrCode(""); 
    setFinalMessage(""); 
  };

  return (
    <div className="App">
      {!registered ? (
        <div>
          <h2 className="custom-heading">Enter your name to join the game:</h2>
          <input
            className="input"
            placeholder="Enter Your Name"
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button
            onClick={handleRegistration}
            className="cssbuttons-io-button"
          >
            Get started
            <div className="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>

          <br />
          <h3>Scan the QR code to play on mobile:</h3>
          {loadingQrCode ? (
            <p>Loading QR Code...</p>
          ) : (
            <img src={qrCode} alt="QR Code" />
          )}
        </div>
      ) : quizEnded ? (
        <div className="quiz-container">
          <h2 className="quiz-question">{finalMessage}</h2> 
          <button className="submit-btn" onClick={handleRestart}>
            Restart Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          <h2 className="quiz-question">{question.question || "Loading question..."}</h2>
          {question.options.length > 0 ? (
            question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                className={`quiz-option ${
                  selectedOption === index ? "selected" : ""
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            <p>Loading options...</p>
          )}
          <br />
          <button
            className="submit-btn"
            onClick={submitAnswer}
            disabled={selectedOption === null}
          >
            Submit Answer
          </button>

          {result && (
            <h3 className={`quiz-result ${isCorrectAnswer ? "correct" : "incorrect"}`}>
              {isCorrectAnswer
                ? `Congratulations, ${playerName}! ${result}`
                : result}
            </h3>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
