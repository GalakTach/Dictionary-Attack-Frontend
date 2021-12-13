import "./components.css";

const Letter = (props) => {
  let handleClick = () => {
    console.log(props.letter);
  };
  return (
    <div className="Letter" onClick={handleClick}>
      <p>{props.letter}</p>
    </div>
  );
};

export default Letter;
