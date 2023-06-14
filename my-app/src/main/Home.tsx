import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TyppingGame from "./TyppingGame";


const Home = () => {
  const [visible, setVisible] = useState({
    hello: true,
    and: false,
    welcome: false,
    typpingGame: false
  });

  useEffect(() => {
    const timeouts = [
      setTimeout(() => {
        setVisible((prevState) => ({
          ...prevState,
          hello: false,
          and: true
        }));
      }, 2000),
      setTimeout(() => {
        setVisible((prevState) => ({
          ...prevState,
          and: false,
          welcome: true
        }));
      }, 4000),
      setTimeout(() => {
        setVisible((prevState) => ({
          ...prevState,
          welcome: false,
        }));
      }, 6000),
      setTimeout(() => {
        setVisible((prevState) => ({
          ...prevState,
          typpingGame: true,
        }));
      }, 7000)
    ];

    return () => timeouts.forEach((timeout) => clearTimeout(timeout));
  }, []);

  return (
    <Container>
      <div>
        <h1 className={`fade ${visible.hello ? "in" : "out"}`}>Hello</h1>
        <h1 className={`fade ${visible.and ? "in" : "out"}`}>And</h1>
        <h1 className={`fade ${visible.welcome ? "in" : "out"}`}>Welcome</h1>
        {visible.typpingGame && <TyppingGame />}
      </div>
    </Container>
  );
};

export default Home;
