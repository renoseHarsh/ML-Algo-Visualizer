import Graph from "./Graph";
import Navbar from "./Navbar";
import "./styles/App.css";
import { useState } from "react";

function App() {
  const [index, setIndex] = useState(null);

  return (
    <div className="main">
      <Navbar index={index} setIndex={setIndex} />
      {index}
      <Graph />
    </div>
  );
}

export default App;