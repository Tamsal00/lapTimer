import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [isRunning, setIsRunning] = useState(false);
  const audioRef = useRef(null);

  const handleBreakDecrement = () => {
    if (breakLength > 1) {
      setBreakLength(breakLength - 1);
    }
  }; 

  const handleBreakIncrement = () => {
    if (breakLength < 60) {
      setBreakLength(breakLength + 1);
    }
  };

  const handleSessionDecrement = () => {
    if (sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      setTimeLeft((sessionLength - 1) * 60);
    }
  };

  const handleSessionIncrement = () => {
    if (sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      setTimeLeft((sessionLength + 1) * 60);
    }
  };

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel('Session');
    setIsRunning(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let intervalId;
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      audioRef.current.play();
      if (timerLabel === 'Session') {
        setTimerLabel('Break');
        setTimeLeft(breakLength * 60);
      } else if (timerLabel === 'Break') {
        setTimerLabel('Session');
        setTimeLeft(sessionLength * 60);
      }
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, breakLength, sessionLength, timerLabel]);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? '0' : '') +
      minutes +
      ':' +
      (seconds < 10 ? '0' : '') +
      seconds
    );
  };
  return (
    <div>
      <div id="break-label">Break Length</div>
      <div id="break-controls">
        <button id="break-decrement" onClick={handleBreakDecrement}>
          -
        </button>
        <div id="break-length">{breakLength}</div>
        <button id="break-increment" onClick={handleBreakIncrement}>
          +
        </button>
      </div>

      <div id="session-label">Session Length</div>
      <div id="session-controls">
        <button id="session-decrement" onClick={handleSessionDecrement}>
          -
        </button>
        <div id="session-length">{sessionLength}</div>
        <button id="session-increment" onClick={handleSessionIncrement}>
          +
        </button>
      </div>

      <div id="timer">
        <div id="timer-label">{timerLabel}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>

      <audio id="beep" ref={audioRef}>
        <source
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          type="audio/wav"
        />
      </audio>
    </div>
  );
  }

  export default App;