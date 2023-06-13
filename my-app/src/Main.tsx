import { Route, Routes } from "react-router-dom";
import Home from "./main/Home";

const Main = () => {
  return (
    <Routes>
        <></>
      <Route index element={<Home />} />
    </Routes>
  );
};
export default Main;
