import "./styles/Navbar.css";
function NavItem({ id, text, index, setIndex }) {
  const texts = text.split(" ");
  const handleClick = () => {
    setIndex(id);
  };
  return (
    <div
      className={id !== index ? "nav-item" : "active-nav-item"}
      id={id}
      onClick={handleClick}
    >
      <p>{texts[0]}</p>
      <p>{texts[1]}</p>
    </div>
  );
}

function Navbar({ index, setIndex }) {
  const algos = [
    { id: 0, text: "Linear Regression" },
    { id: 1, text: "Logistic Regression" },
    { id: 2, text: "Decision Trees" },
  ];

  return (
    <div className="header">
      {algos.map((algo) => {
        return (
          <NavItem
            key={algo.id}
            id={algo.id}
            text={algo.text}
            index={index}
            setIndex={setIndex}
          />
        );
      })}
    </div>
  );
}

export default Navbar;
