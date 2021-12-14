import React from "react";
import "./components.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { word: "", wordList: "", wordsPlayed: 0 };
    this.addLetter = this.addLetter.bind(this);
    this.clearWord = this.clearWord.bind(this);
    this.submitWord = this.submitWord.bind(this);
  }

  addLetter(letter) {
    this.setState({ word: this.state.word + letter });
  }

  clearWord() {
    this.setState({ word: "" });
  }

  submitWord() {
    /* link to word validation backend here */
    this.setState({
      wordList: this.state.wordList + this.state.word + " ",
      wordsPlayed: this.state.wordsPlayed + 1,
    });
  }

  render() {
    return (
      <div className="ColumnTray">
        <div className="SideColumn">
          <h2>Character goes here</h2>
        </div>
        <div>
          <WordBox currentWord={this.state.word} />
          <div className="LetterBox">
            <Letter
              letter="L"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="O"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="R"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="E"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="M"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="I"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="P"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="S"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="U"
              handleClick={(letter) => this.addLetter(letter)}
            />
            <Letter
              letter="M"
              handleClick={(letter) => this.addLetter(letter)}
            />
          </div>
          <div className="RowTray">
            <BigButton content="Submit" handleClick={this.submitWord} />
            <BigButton content="Clear" handleClick={this.clearWord} />
          </div>
        </div>
        <WordList wordlist={this.state.wordList} />
      </div>
    );
  }
}

const WordBox = (props) => {
  if (props.currentWord === "") {
    return <h2 class="WordBox">Current word: None!</h2>;
  } else {
    return <h2 class="WordBox">Current word: {props.currentWord}</h2>;
  }
};

const Letter = (props) => {
  return (
    <div className="Letter" onClick={() => props.handleClick(props.letter)}>
      <p>{props.letter}</p>
    </div>
  );
};

const BigButton = (props) => {
  return (
    <div className="BigButtonContainer">
      <div className="BigButton" onClick={() => props.handleClick()}>
        <p>{props.content}</p>
      </div>
    </div>
  );
};

const WordList = (props) => {
  if (props.wordlist === "") {
    return (
      <div class="SideColumn">
        <h2>Recent Words</h2>
        <p>No words yet!</p>
      </div>
    );
  } else {
    let list = props.wordlist.replaceAll(" ", "\n");
    return (
      <div class="SideColumn">
        <h2>Recent Words</h2>
        <p>{list}</p>
      </div>
    );
  }
};
export default Game;
