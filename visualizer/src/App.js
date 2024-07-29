import LinearRegression from "./LinearRegression";
import Navbar from "./Navbar";
import "./styles/App.css";
import { useState } from "react";

function App() {
  const [index, setIndex] = useState(0);

  return (
    <div className="main">
      <Navbar index={index} setIndex={setIndex} />
      {index === 0 ? <LinearRegression /> : null}
    </div>
  );
}

export default App;
