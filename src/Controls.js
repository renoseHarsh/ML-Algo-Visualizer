import { useEffect, useRef, useState } from "react";
import "./styles/Controls.css";
import { layers, sequential, tensor, tensor2d, train } from "@tensorflow/tfjs";

function Controls({ props }) {
  const data = props.data;
  const setData = props.setData;
  const setLine = props.setLine;
  const [lr, setLR] = useState(0.01);
  const isTraining = props.isTraining;
  const [model, setModel] = useState(null);
  const [features, setFeatures] = useState([]);
  const xSqur = (x) => x * x;
  const xCub = (x) => x * x * x;
  const xQuad = (x) => x * x * x * x;
  const sin = (x) => Math.sin(x);
  const [seeXsqr, setSeeXsqr] = useState(false);
  const [seeXcub, setSeeXcub] = useState(false);
  const [seeXquad, setSeeXquad] = useState(false);
  const [seeSin, setSeeSin] = useState(false);
  const X = useRef(null);
  const Y = useRef(null);
  const funs = {
    sqr: xSqur,
    cub: xCub,
    quad: xQuad,
    sin: sin,
  };

  const weig = {
    x: useRef(null),
    sqr: useRef(null),
    cub: useRef(null),
    quad: useRef(null),
    sin: useRef(null),
  };

  useEffect(genModel, [lr, features]);

  function genModel() {
    const tempMo = sequential();
    const optimizer = train.adam(lr);
    tempMo.add(layers.dense({ units: 1, inputShape: [features.length + 1] }));
    tempMo.compile({
      optimizer: optimizer,
      loss: "meanSquaredError",
      metrics: ["mse"],
    });

    const newWei = [[Math.random()]];
    weig.x.current = newWei[0][0];
    for (var i = 0; i < features.length; i++) {
      const temp = Math.random();
      newWei.push([temp]);
      weig[features[i]].current = temp;
    }
    const kernel = tensor2d(newWei, [features.length + 1, 1]);
    const bias = tensor([0.0]);
    tempMo.setWeights([kernel, bias]);
    const info = tempMo.getWeights();
    setModel(tempMo);
    const temp = tempMo.getWeights()[0].dataSync();
  }

  const train1000 = async () => {
    const X_tensor = X.current;
    const Y_tensor = Y.current;

    await model.fit(X_tensor, Y_tensor, {
      epochs: 1,
      callbacks: {
        onEpochEnd: async (epoch, logs) => {
          createLine();
          updateWeights();
        },
      },
    });

    if (isTraining.current === true) {
      train1000();
    }
  };

  const updateWeights = () => {
    const temp = model.getWeights()[0].dataSync();
    const weights = [];
    for (var i = 0; i < temp.length; i++) {
      weights.push(temp[i]);
    }
    weig.x.current = weights[0];
    for (var i = 0; i < features.length; i++) {
      console.log(weights[i + 1]);
      weig[features[i]].current = weights[i + 1];
    }
  };

  const startIntervalandExcute = () => {
    const tempX = data.map((point) => [
      point.x,
      ...features.map((f) => funs[f](point.x)),
    ]);
    const tempY = data.map((point) => point.y);
    X.current = new tensor2d(tempX, [tempX.length, features.length + 1]);
    Y.current = new tensor2d(tempY, [tempY.length, 1]);
    isTraining.current = true;
    train1000();
  };

  const getLineData = () => {
    const inter = 0.01;
    const line = [];
    for (var i = 0; i < 1; i += inter + inter) {
      const temp = [];
      const X = [i, ...features.map((f) => funs[f](i))];
      const Y = model
        .predict(tensor2d([X], [1, features.length + 1]))
        .dataSync();
      temp.push({ x: i, y: Y[0] });
      const X2 = [i + inter, ...features.map((f) => funs[f](i + inter))];
      const Y2 = model
        .predict(tensor2d([X2], [1, features.length + 1]))
        .dataSync();
      temp.push({ x: i + inter, y: Y2[0] });
      line.push(temp);
    }
    return line;
  };

  const createLine = () => {
    if (model === null) return;
    const lineData = getLineData();
    setLine(lineData);
  };

  const toFixed3 = (num) => {
    if (num === null) return 0.01;
    return num.toFixed(3);
  };

  return (
    <div className="linear-contols">
      <div className="control-section">
        <p>Total Data Points</p>
        <p className="data-counter-digit">{data.length}</p>
      </div>
      <div className="control-section">
        <p>Use Learning Rate</p>
        <input
          className="learning-rate"
          type="number"
          value={lr}
          onChange={(e) => setLR(e.target.value)}
          disabled={isTraining.current}
        />
      </div>
      <div className="select-weights">
        <p>Select Weights</p>
        <div className="weights">
          <div className="weight-info">
            <button className="weight-active">&#119909;</button>
            <p>{toFixed3(weig["x"].current)}</p>
          </div>

          <div className="weight-info">
            <button
              className={seeXsqr ? "weight-active" : "weight"}
              onClick={() => {
                if (features.includes("sqr")) {
                  setFeatures(features.filter((f) => f !== "sqr"));
                } else {
                  setFeatures([...features, "sqr"]);
                }
                setSeeXsqr(!seeXsqr);
              }}
            >
              &#119909;&#178;
            </button>
            {features.includes("sqr") ? (
              <p>{toFixed3(weig["sqr"].current)}</p>
            ) : (
              <p></p>
            )}
          </div>

          <div className="weight-info">
            <button
              className={seeXcub ? "weight-active" : "weight"}
              onClick={() => {
                if (features.includes("cub")) {
                  setFeatures(features.filter((f) => f !== "cub"));
                } else {
                  setFeatures([...features, "cub"]);
                }
                setSeeXcub(!seeXcub);
              }}
            >
              &#119909;&#179;
            </button>
            {features.includes("cub") ? (
              <p>{toFixed3(weig["cub"].current)}</p>
            ) : null}
          </div>

          <div className="weight-info">
            <button
              className={seeXquad ? "weight-active" : "weight"}
              onClick={() => {
                if (features.includes("quad")) {
                  setFeatures(features.filter((f) => f !== "quad"));
                } else {
                  setFeatures([...features, "quad"]);
                }
                setSeeXquad(!seeXquad);
              }}
            >
              &#119909;&#8308;
            </button>
            {features.includes("quad") ? (
              <p>{toFixed3(weig["quad"].current)}</p>
            ) : null}
          </div>

          <div className="weight-info">
            <button
              className={seeSin ? "weight-active" : "weight"}
              onClick={() => {
                if (features.includes("sin")) {
                  setFeatures(features.filter((f) => f !== "sin"));
                } else {
                  setFeatures([...features, "sin"]);
                }
                setSeeSin(!seeSin);
              }}
            >
              sin(&#119909;)
            </button>
            {features.includes("sin") ? (
              <p>{toFixed3(weig["sin"].current)}</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="actions">
        <div className="actions-outer">
          <div className="actions-inner">
            <button
              className="action-train"
              disabled={data.length === 0}
              onClick={startIntervalandExcute}
            >
              Train
            </button>
            <button
              className="action-stop"
              onClick={() => {
                isTraining.current = false;
              }}
            >
              Stop
            </button>
          </div>
          <div className="actions-inner">
            <button
              className="action-clear"
              onClick={() => {
                setData([]);
                setLine([]);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controls;
