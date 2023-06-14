import { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ButtonGroup,
} from "react-bootstrap";
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
  const dingAudioRef = useRef<any>(null);
  const [difficulty, setDifficulty] = useState("");
  const [wordLength, setWordLength] = useState(0);

  useEffect(() => {
    const fetchWords = async () => {
      const response = await fetch(
        `https://random-word-api.herokuapp.com/word?number=1000&length=${wordLength}`
      );
      const data = await response.json();
      setWords(data);
    };

    fetchWords();
  }, [wordLength]);

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
        dingAudioRef.current.currentTime = 0;
        dingAudioRef.current.play();
      }
    }
  }, [typedWord, words, currentWordIndex]);

  useEffect(() => {
    if (gameReady && gameContainerRef.current && !appRef.current) {
      const app = new PIXI.Application({ width: 800, height: 600 });
      appRef.current = app;
      gameContainerRef.current.appendChild(app.view as any);

      const text = new PIXI.Text(words[currentWordIndex], {
        fontSize: 48,
        fill: "white",
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
      }, 60500);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleInputChange = (e: any) => {
    setTypedWord(e.target.value);
  };

  const restartGame = () => {
    window.location.reload();
  };

  const returnHome = () => {
    window.location.href = "/";
  };

  const handleStartGame = () => {
    setScore(0);
    setTime(0);
    setCurrentWordIndex(0);
    setShowModal(false);
    setGameReady(true);
  };

  const handleDifficultyChange = (value: any) => {
    setDifficulty(value);
    if (value === "Easy") {
      setWordLength(5);
    } else if (value === "Medium") {
      setWordLength(10);
    } else if (value === "Hard") {
      setWordLength(15);
    }
  };

  return (
    <Container className="mb-5">
      <Row className="mb-3">
        {gameReady && (
          <>
            <Col className="col-sm-5">
              <h5>Score: {score}</h5>
            </Col>
            <Col className="col-sm-4">
              <h5>Time: {time}s / 60s</h5>
            </Col>
            <Col className="col-sm-4">
              <h5>Difficulty: {difficulty}</h5>
            </Col>
          </>
        )}
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
          <div className="typing-animation square-animation">
            {!gameReady && <h1 className="typing-animation2">Typing Game</h1>}
            <h5>Select Difficulty: {wordLength} words</h5>
            <ButtonGroup className="gap-3">
              <Button
                variant={difficulty === "Easy" ? "success" : "outline-success"}
                onClick={() => handleDifficultyChange("Easy")}
              >
                Easy
              </Button>
              <Button
                variant={
                  difficulty === "Medium" ? "warning" : "outline-warning"
                }
                onClick={() => handleDifficultyChange("Medium")}
              >
                Medium
              </Button>
              <Button
                variant={difficulty === "Hard" ? "danger" : "outline-danger"}
                onClick={() => handleDifficultyChange("Hard")}
              >
                Hard
              </Button>
              <Button
                className="ms-1"
                variant="success"
                onClick={handleStartGame}
                disabled={!difficulty}
              >
                Start Game
              </Button>
            </ButtonGroup>
          </div>
        )}
      </Row>

      <audio ref={dingAudioRef} />
      <Modal
        className="text-center cl"
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
          <Button onClick={returnHome} variant="primary">
            Return Home
          </Button>
          <Button variant="primary" onClick={restartGame}>
            Restart
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TyppingGame;
