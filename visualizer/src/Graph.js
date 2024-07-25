import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";
import "./styles/Graph.css";
import { useState } from "react";
import { layers, sequential, tensor2d } from "@tensorflow/tfjs";

function Graph() {
  const [data, setData] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [line, setLine] = useState([]);
  const [model, setModel] = useState(null);
  const [isTraining, setIsTraining] = useState(true);

  if (model === null) {
    const tempMo = sequential();
    tempMo.add(layers.dense({ units: 1, inputShape: [1] }));
    tempMo.compile({
      optimizer: "adam",
      loss: "meanSquaredError",
      metrics: ["mse"],
    });
    setModel(tempMo);
  }

  const getLineData = () => {
    const m = model.getWeights()[0].dataSync()[0];
    const b = model.getWeights()[1].dataSync()[0];
    const start = [0, 0 * m + b];
    const end = [1, 1 * m + b];

    if (start[1] > 1 && end[1] < 0) {
      const newStart = [-b / m, 0];
      const newEnd = [(1 - b) / m, 1];
      return [
        { x: newStart[0], y: newStart[1] },
        { x: newEnd[0], y: newEnd[1] },
      ];
    } else if (start[1] > 1) {
      const newStart = [-b / m, 0];
      return [
        { x: newStart[0], y: newStart[1] },
        { x: end[0], y: end[1] },
      ];
    } else if (end[1] < 0) {
      const newEnd = [(1 - b) / m, 1];
      return [
        { x: start[0], y: start[1] },
        { x: newEnd[0], y: newEnd[1] },
      ];
    }

    if (start[1] < 0 && end[1] > 1) {
      const newStart = [-b / m, 0];
      const newEnd = [(1 - b) / m, 1];
      return [
        { x: newStart[0], y: newStart[1] },
        { x: newEnd[0], y: newEnd[1] },
      ];
    } else if (start[1] < 0) {
      const newStart = [-b / m, 0];
      return [
        { x: newStart[0], y: newStart[1] },
        { x: end[0], y: end[1] },
      ];
    } else if (end[1] > 1) {
      const newEnd = [(1 - b) / m, 1];
      return [
        { x: start[0], y: start[1] },
        { x: newEnd[0], y: newEnd[1] },
      ];
    } else {
      return [
        { x: start[0], y: start[1] },
        { x: end[0], y: end[1] },
      ];
    }
  };

  const handleClick = (e) => {
    setData([...data, { x: e.xValue, y: e.yValue, z: 100 }]);
    setMouseDown(true);
  };

  const onMouseMove = (e) => {
    if (!mouseDown) return;
    setData([...data, { x: e.xValue, y: e.yValue, z: 100 }]);
  };

  const createLine = () => {
    if (model === null) return;
    const lineData = getLineData();
    console.log(lineData);
    setLine(lineData);
  };

  const train1000 = async () => {
    console.log(isTraining)
    const X = data.map((point) => point.x);
    const Y = data.map((point) => point.y);
    const X_tensor = new tensor2d(X, [X.length, 1]);
    const Y_tensor = new tensor2d(Y, [Y.length, 1]);

    await model.fit(X_tensor, Y_tensor, {
      epochs: 1,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          createLine();
          console.log("Epoch: " + epoch + " Loss: " + logs.loss);
        },
      },
    });
    createLine();
    if (isTraining) train1000();
    setModel(model);
  };

  return (
    <div className="graph">
      <ResponsiveContainer width="100%" height="100%" className="chart">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
          onMouseDown={handleClick}
          onMouseMove={onMouseMove}
          onMouseUp={() => setMouseDown(false)}
          onMouseLeave={() => setMouseDown(false)}
          cursor="pointer"
        >
          <XAxis
            type="number"
            dataKey="x"
            domain={[0, 1]}
            tickCount={11}
            includeHidden
            label={{ value: "X", position: "bottom", offset: 0 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 1]}
            tickCount={11}
            includeHidden
            label={{ value: "Y", position: "left", offset: 0 }}
          />
          <ZAxis type="number" dataKey="z" range={[10, 10]} />
          <Scatter data={data} fill="#8884d8" isAnimationActive={false} />
          <ReferenceLine stroke="red" segment={line} />
        </ScatterChart>
      </ResponsiveContainer>
      <button
        onClick={() => {
          setData([]);
          setLine([]);
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          train1000();
          console.log("DO");
        }}
      >
        DO
      </button>
      <button onClick={createLine}>Draw</button>
      <button onClick={() => setIsTraining(true)}>Train</button>
      <button onClick={() => setIsTraining(false)}>Stop</button>
    </div>
  );
}

export default Graph;
