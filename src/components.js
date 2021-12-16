import React from "react";
import "./components.css";

// declaring these here for readability + easier balance changes
const baseWordScore = 200;
const bonusLetterMultiplier = 1.5;
const minimumWordLength = 3;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = { word: "", wordList: "", wordsPlayed: 0, time: 0, score: 0 };
    this.addLetter = this.addLetter.bind(this);
    // this.calculateWordScore = this.calculateWordScore(this);
    this.clearWord = this.clearWord.bind(this);
    this.submitWord = this.submitWord.bind(this);
  }

  addLetter(letter) {
    this.setState({ word: this.state.word + letter });
  }

  calculateWordScore(word) {
    return (
      baseWordScore *
      Math.pow(bonusLetterMultiplier, word.length - minimumWordLength)
    );
  }

  clearWord() {
    this.setState({ word: "" });
  }

  submitWord() {
    /* link to word validation backend here */
    if (this.state.word.length >= 3) {
      // check word length
      this.setState({
        wordList: this.state.wordList + this.state.word + " ",
        wordsPlayed: this.state.wordsPlayed + 1,
        score: this.state.score + this.calculateWordScore(this.state.word),
        word: "",
      });
    } else {
      // update mascot dialogue/error message to say "Sorry, that word's too short!"
    }
  }

  render() {
    return (
      <div className="RowTray" id="GameContainer">
        <div className="SideColumn">
          <Mascot dialogue="Welcome to Dictionary Attack!" />
          <Options />
        </div>
        <div className="CenterColumn">
          <div>
            <h1>Dictionary Attack!</h1>
            <div className="RowTray">
              <h3>Time: {this.state.time}</h3>
              <h3>Score: {this.state.score}</h3>
            </div>
          </div>
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
        <div className="SideColumn">
          <WordList wordlist={this.state.wordList} />
          <HighScores />
        </div>
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
      <div id="WordList" className="SidebarBox">
        <h2>Recent Words</h2>
        <p>No words yet!</p>
      </div>
    );
  } else {
    let list = props.wordlist.replaceAll(" ", "\n");
    return (
      <div id="WordList" className="SidebarBox">
        <h2>Recent Words</h2>
        <p>{list}</p>
      </div>
    );
  }
};

const Mascot = (props) => {
  return (
    <div id="MascotBox" className="SidebarBox">
      <img
        src="../mascot.png"
        id="Mascot"
        alt="Thesaurus Rex"
        title="Thesaurus Rex"
      />
      <p>
        <b>Thesaurus Rex says:</b>
        <br />
        {props.dialogue}
      </p>
    </div>
  );
};

const HighScores = (props) => {
  return (
    <div id="HighScores" className="SidebarBox">
      <h2>High Scores</h2>
      <p>No high scores yet!</p>
    </div>
  );
};

const Options = (props) => {
  return (
    <div id="Options" className="SidebarBox">
      <h2>Options</h2>
      <p>No options yet!</p>
    </div>
  );
};
export default Game;
