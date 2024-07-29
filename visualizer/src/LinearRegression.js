import { useEffect, useRef, useState } from "react";
import Controls from "./Controls";
import Graph from "./Graph";
import "./styles/GraphContainer.css";

function LinearRegression() {
  const [data, setData] = useState([]);
  const [line, setLine] = useState([]);
  const isTraining = useRef(false);

  const graphProps = {
    data: data,
    setData: setData,
    isTraining: isTraining,
    line: line,
  };

  const controlProps = {
    data: data,
    setData: setData,
    isTraining: isTraining,
    setLine: setLine,
  };
  return (
    <div className="main-body">
      <Graph props={graphProps} />
      <Controls props={controlProps} />
    </div>
  );
}

export default LinearRegression;
