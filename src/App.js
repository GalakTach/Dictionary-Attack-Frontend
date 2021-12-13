import logo from "./logo.svg";
import "./App.css";
import Letter from "./components";
import "./components.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="LetterBox">
          <Letter letter="L" />
          <Letter letter="O" />
          <Letter letter="R" />
          <Letter letter="E" />
          <Letter letter="M" />
          <Letter letter="I" />
          <Letter letter="P" />
          <Letter letter="S" />
          <Letter letter="U" />
          <Letter letter="M" />
        </div>
      </header>
    </div>
  );
}

export default App;
