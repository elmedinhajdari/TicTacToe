import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal, ButtonGroup } from "react-bootstrap";
import * as PIXI from "pixi.js";
import dingSound from "../sound/ding.mp3";

const TyppingGame = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const [gameReady, setGameReady] = useState(false);
  const dingAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(
        "https://random-word-api.herokuapp.com/word?number=1000&length=15"
      );
      const data = await response.json();
      setWords(data);
    };

    fetchWords();
  }, []);

  useEffect(() => {
    startTimer();

    return () => {
      stopTimer();
    };
  }, [gameReady]);

  useEffect(() => {
    if (typedWord === words[currentWordIndex]) {
      setScore((prevScore) => prevScore + 1);
      setTypedWord("");
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      if (dingAudioRef.current) {
        dingAudioRef.current.play();
      }
    }
  }, [typedWord, words, currentWordIndex]);

  useEffect(() => {
    if (gameReady && gameContainerRef.current && !appRef.current) {
      // Set up Pixi.js stage and renderer
      const app = new PIXI.Application({ width: 800, height: 600 });
      appRef.current = app;
      gameContainerRef.current.appendChild(app.view as any);

      // Create a text element for displaying the current word
      const text = new PIXI.Text(words[currentWordIndex], {
        fontSize: 48,
        fill: "green",
      });
      text.anchor.set(0.5);
      text.x = app.screen.width / 2;
      text.y = app.screen.height / 2;
      app.stage.addChild(text);
    }

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
      }
    };
  }, [currentWordIndex, words, gameReady]);

  useEffect(() => {
    if (dingAudioRef.current) {
      dingAudioRef.current.src = dingSound;
    }
  }, []);

  const startTimer = () => {
    if (gameReady) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      setTimeout(() => {
        stopTimer();
        setShowModal(true);
      }, 61000);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedWord(e.target.value);
  };

  const startGame = () => {
    setGameReady(true);
  };

  const restartGame = () => {
    window.location.reload();
  };

  return (
    <Container>
      <h1 className="mt-4 mb-3">Typing Game</h1>
      <Row className="mb-3">
        <Col>
          <h5>Score: {score}</h5>
        </Col>
        <Col>
          <h5>Time: {time} seconds</h5>
        </Col>
      </Row>
      <Row className="justify-content-center align-items-center">
        {gameReady ? (
          <>
            <Col>
              <div ref={gameContainerRef} />
            </Col>
            <Row className="mt-3">
              <Col>
                <input
                  type="text"
                  value={typedWord}
                  onChange={handleInputChange}
                  placeholder="Type the word here"
                />
              </Col>
            </Row>
          </>
        ) : (
          <ButtonGroup>
            <Button variant="primary" onClick={startGame}>
              Start
            </Button>
          </ButtonGroup>
        )}
      </Row>
      <audio ref={dingAudioRef} />
      <Modal
        className="text-center"
        show={showModal}
        onHide={restartGame}
        centered
      >
        <Modal.Header style={{ margin: "0 auto" }}>
          <Modal.Title>Game Over!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your final score: {score}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={restartGame}>
            Restart
          </Button>
          <Button variant="primary" onClick={restartGame}>
            Return Home
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TyppingGame;
