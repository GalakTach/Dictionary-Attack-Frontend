import React from "react";
import "./components.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { word: "" };
    this.addLetter = this.addLetter.bind(this);
    this.clearWord = this.clearWord.bind(this);
  }

  addLetter(letter) {
    this.setState({ word: this.state.word + letter });
  }

  clearWord() {
    this.setState({ word: "" });
  }

  render() {
    return (
      <div>
        <WordBox currentWord={this.state.word} />
        <div className="LetterBox">
          <Letter letter="L" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="O" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="R" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="E" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="M" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="I" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="P" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="S" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="U" handleClick={(letter) => this.addLetter(letter)} />
          <Letter letter="M" handleClick={(letter) => this.addLetter(letter)} />
        </div>
        <button onClick={this.clearWord}>Clear Word</button>
      </div>
    );
  }
}

const WordBox = (props) => {
  if (props.currentWord === "") {
    return <p class="WordBox">Current word: None!</p>;
  } else {
    return <p class="WordBox">Current word: {props.currentWord}</p>;
  }
};

const Letter = (props) => {
  return (
    <div className="Letter" onClick={() => props.handleClick(props.letter)}>
      <p>{props.letter}</p>
    </div>
  );
};

export default Game;
