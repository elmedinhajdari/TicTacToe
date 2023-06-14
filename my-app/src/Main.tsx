import { Route, Routes } from "react-router-dom";
import Home from "./main/Home";
import TyppingGame from "./main/TyppingGame";
import NavBar from "./components/NavBar";

const Main = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="typpinggame" element={<TyppingGame />} />
      </Routes>
    </>
  );
};

export default Main;
