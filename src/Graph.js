import {
  ResponsiveContainer,
  ScatterChart,
  XAxis,
  YAxis,
  Scatter,
  ZAxis,
  ReferenceLine,
  Line,
} from "recharts";
import "./styles/Graph.css";
import { useRef, useState } from "react";
import { layers, sequential, tensor, tensor2d, train } from "@tensorflow/tfjs";

function Graph({ props }) {
  const data = props.data;
  const setData = props.setData;
  const isTraining = props.isTraining;
  const [mouseDown, setMouseDown] = useState(false);
  const line = props.line;

  const handleClick = (e) => {
    if (isTraining.current) return;
    if (!e.xValue || !e.yValue) return;
    setData([...data, { x: e.xValue, y: e.yValue, z: 100 }]);
    setMouseDown(true);
  };

  const onMouseMove = (e) => {
    if (!mouseDown || isTraining.current) return;
    if (!e.xValue || !e.yValue) return;
    setData([...data, { x: e.xValue, y: e.yValue, z: 100 }]);
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
            label={{
              value: "X",
              position: "bottom",
              offset: 0,
              stroke: "white",
            }}
            stroke="white"
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[0, 1]}
            tickCount={11}
            includeHidden
            label={{ value: "Y", position: "left", offset: 0, stroke: "white" }}
            stroke="white"
          />
          <ZAxis type="number" dataKey="z" range={[10, 10]} />
          <Scatter data={data} fill="#8884d8" isAnimationActive={false} />
          {line.map((segment, i) => (
            <ReferenceLine stroke="red" segment={segment} />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
