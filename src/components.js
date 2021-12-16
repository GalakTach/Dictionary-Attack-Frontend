import React from "react";
import "./components.css";

// declaring these here for readability + easier balance changes
const baseWordScore = 200;
const bonusLetterMultiplier = 1.5;
const minimumWordLength = 3;
const startingTileCount = 10;
const startingRoundLength = 120;

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      wordList: "",
      wordsPlayed: 0,
      time: startingRoundLength,
      score: 0,
      wordDisplay: [],
      availableTiles: Array(startingTileCount).fill(1),
      letterTray: [],
    };
    this.addLetter = this.addLetter.bind(this);
    this.removeLetter = this.removeLetter.bind(this);
    // this.calculateWordScore = this.calculateWordScore(this);
    this.clearWord = this.clearWord.bind(this);
    this.generateLetterTray = this.generateLetterTray.bind(this);
    this.submitWord = this.submitWord.bind(this);
    this.reset = this.reset.bind(this);
  }

  componentDidMount() {
    this.setState({ letterTray: this.generateLetterTray() });
  }

  generateLetterTray() {
    let tray = [];
    for (let i = 0; i < startingTileCount; i++) {
      tray[i] = (
        <Letter
          key={i}
          letter={alphabet.charAt(Math.floor(Math.random() * 26))}
          trayPosition={i}
          wordPosition={-1}
          handleClick={(letter, trayPosition, wordPosition) =>
            this.addLetter(letter, trayPosition, wordPosition)
          }
        />
      );
    }
    return tray;
  }

  reset() {
    this.setState({
      word: "",
      wordList: "",
      wordsPlayed: 0,
      time: startingRoundLength,
      score: 0,
      wordDisplay: [],
      availableTiles: Array(startingTileCount).fill(1),
      letterTray: this.generateLetterTray(),
    });
  }

  addLetter(letter, trayPosition, wordPosition) {
    if (this.state.availableTiles[trayPosition] === 1) {
      this.setState({
        word: this.state.word + letter,
        wordDisplay: this.state.wordDisplay.concat([
          <Letter
            key={this.state.wordDisplay.length}
            letter={letter}
            trayPosition={trayPosition}
            wordPosition={this.state.wordDisplay.length}
            handleClick={(letter, trayPosition, wordPosition) =>
              this.removeLetter(letter, trayPosition, wordPosition)
            }
          />,
        ]),
      });
      this.setState((state) => {
        // console.log(state.availableTiles.toString() + " ==>");
        state.availableTiles[trayPosition] = 0;
        // console.log(state.availableTiles.toString());
        return state;
      });
    } else {
      console.log("Letter unavailable!");
    }
  }

  removeLetter(letter, trayPosition, wordPosition) {
    this.setState((state) => {
      // console.log("Tile clicked on: #" + wordPosition);
      // console.log(state.availableTiles.toString() + " ==>");
      for (let i = state.wordDisplay.length; i >= wordPosition + 1; i--) {
        // starting from the end of the word and working backward, remove and then free up each tile
        state.availableTiles[state.wordDisplay.pop().props.trayPosition] = 1;
      }
      // also trim the internal string to match
      state.word = state.word.substring(0, wordPosition);
      // console.log(state.availableTiles.toString());
      return state;
    });
  }

  calculateWordScore(word) {
    return (
      baseWordScore *
      Math.pow(bonusLetterMultiplier, word.length - minimumWordLength)
    );
  }

  clearWord() {
    this.setState({
      word: "",
      wordDisplay: [],
      availableTiles: this.state.availableTiles.fill(1),
    });
  }

  submitWord() {
    /* link to word validation backend here */
    if (this.state.word.length >= 3) {
      // check word length
      this.setState({
        wordList: this.state.wordList + this.state.word + " ",
        wordsPlayed: this.state.wordsPlayed + 1,
        score: this.state.score + this.calculateWordScore(this.state.word),
      });
      this.clearWord();
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
          <button onClick={this.reset}>Reset Game</button>
        </div>
        <div className="CenterColumn">
          <div>
            <h1>Dictionary Attack!</h1>
            <div className="RowTray">
              <h3>Time: {this.state.time}</h3>
              <h3>Score: {this.state.score}</h3>
            </div>
          </div>
          {/* <WordBox currentWord={this.state.word} /> */}
          <WordLine letters={this.state.wordDisplay} />
          <div className="LetterBox">{this.state.letterTray}</div>
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

// const WordBox = (props) => {
//   if (props.currentWord === "") {
//     return <h2 className="WordBox">Current word: None!</h2>;
//   } else {
//     return <h2 className="WordBox">Current word: {props.currentWord}</h2>;
//   }
// };

const WordLine = (props) => {
  return (
    <div>
      <h2>Current word:</h2>
      <div className="WordLine">{props.letters}</div>
    </div>
  );
};

const Letter = (props) => {
  return (
    <div
      className="Letter"
      onClick={() =>
        props.handleClick(props.letter, props.trayPosition, props.wordPosition)
      }
    >
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
