import { Route, Routes } from "react-router-dom";
import Home from "./main/Home";
import TyppingGame from "./main/TyppingGame";

const Main = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="typpinggame" element={<TyppingGame />} />
    </Routes>
  );
};
export default Main;
