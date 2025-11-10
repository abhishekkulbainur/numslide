// src/App.jsx
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import GameComponent from './components/GameComponent';
import Phaser from 'phaser'; // We need this for the event emitter

// This emitter is the "phone line" between React and Phaser
const eventEmitter = new Phaser.Events.EventEmitter();

function App() {
  // 1. Create a state variable for the score
  const [score, setScore] = useState(0);

  // 2. Listen for score updates from Phaser
  useEffect(() => {
    // When Phaser emits 'updateScore', we set our React state
    const handleScoreUpdate = (newScore) => {
      setScore(newScore);
    };
    
    eventEmitter.on('updateScore', handleScoreUpdate);

    // Clean up the listener when the component unmounts
    return () => {
      eventEmitter.off('updateScore', handleScoreUpdate);
    };
  }, []); // The empty array [] means this runs only once

  // 3. Create a function to tell Phaser to restart
  const handleNewGame = () => {
    eventEmitter.emit('restartGame');
    setScore(0); // Reset score in React immediately
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Numslide</h1>
        <div className="score-container">
          <span className="label">SCORE</span>
          <span className="score">{score}</span>
        </div>
      </div>

      {/* We pass the emitter to the game component */}
      <GameComponent emitter={eventEmitter} />

      <div className="footer">
        <button className="new-game-button" onClick={handleNewGame}>
          New Game
        </button>
        <p className="instructions">
          Use arrow keys to move. (Swipe controls coming soon!)
        </p>
      </div>
    </div>
  );
}

export default App;