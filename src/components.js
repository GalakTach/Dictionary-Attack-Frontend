import React from "react";
import "./components.css";
import axios from "axios";
import wordsArray from "./startingWords";

// declaring these here for readability + easier balance changes
const baseWordScore = 200;
const bonusLetterMultiplier = 1.5;
const minimumWordLength = 3;
const startingTileCount = 10;
const startingRoundLength = 30;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      wordList: "",
      wordsPlayed: 0,
      wordDisplay: [],
      availableTiles: Array(startingTileCount).fill(1),
      letterTray: [],
      time: {}, //the timer
      seconds: startingRoundLength, //number of seconds to be turned into minutes / seconds
      score: 0,
      wordSet: new Set(),
      errorMessage: "",
      mascotDialogue: "Welcome to Dictionary Attack!",
      wordDefinition: "",
      startingWord: "Lorem",
      mascotSrc: "../mascot.png",
      gameOver: false,
      highScores: []
    };
    this.addLetter = this.addLetter.bind(this);
    this.removeLetter = this.removeLetter.bind(this);
    // this.calculateWordScore = this.calculateWordScore(this);
    this.clearWord = this.clearWord.bind(this);
    this.generateLetterTray = this.generateLetterTray.bind(this);
    this.submitWord = this.submitWord.bind(this);
    this.reset = this.reset.bind(this);
    this.validateWord = this.validateWord.bind(this);
    this.timer = 0; // used to set interval when timer starts. needs to be set to 0 again whenever interval is cleared
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.countDown = this.countDown.bind(this);
    this.getRandomWord = this.getRandomWord.bind(this);
    this.getHighScores = this.getHighScores.bind(this);
  }

  componentDidMount() {
    
    this.setState({
      letterTray: this.generateLetterTray(),
    });
    let timeLeftVar = this.calcTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.getHighScores();
    
  }

  getRandomWord() {
    let i = Math.floor(Math.random() * wordsArray.length);
    let randWord = wordsArray[i].toUpperCase();
    console.log(randWord);
    return randWord;
  }

  generateLetterTray() {
    let tray = [];
    let randWord = this.getRandomWord();

    this.setState({ wordDisplay: [], startingWord: randWord });
    console.log(randWord);
    const array = randWord.split("");

    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    for (let i = 0; i < array.length; i++) {
      tray[i] = (
        <Letter
          key={i}
          letter={array[i]}
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
      wordSet: new Set(),
      mascotSrc: "../mascot.png",
    });

    //reset the timer
    this.resetTimer();
  }
  addLetter(letter, trayPosition, wordPosition) {
    if (!this.state.gameOver) {
      this.startTimer();
    }
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
        errorMessage: "",
      });
      this.setState((state) => {
        // console.log(state.availableTiles.toString() + " ==>");
        state.availableTiles[trayPosition] = 0;
        // console.log(state.availableTiles.toString());
        return state;
      });
    } else {
      this.setState({ mascotDialogue: "Can't select the same letter twice!" });
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
      state.errorMessage = "";
      return state;
    });
  }

  calculateWordScore(word) {
    return Math.floor(
      baseWordScore *
        Math.pow(bonusLetterMultiplier, word.length - minimumWordLength)
    );
  }

  clearWord() {
    this.setState({
      word: "",
      wordDisplay: [],
      availableTiles: this.state.availableTiles.fill(1),
      errorMessage: "",
    });
  }

  goodEnding() {
    this.setState({
      score: this.state.score + baseWordScore * this.state.seconds,
      mascotDialogue: "You got the biggest word! Nice job!",
      gameOver: true,
    });
    this.stopTimer();
  }

  badEnding() {
    this.setState({ mascotDialogue: "Nothing personnel kid.", gameOver: true });
  }

  submitWord() {
    if (!this.state.wordSet.has(this.state.word)) {
      // The word is not in the played words, add to word list and increment words played
      this.setState({
        wordList: this.state.wordList + this.state.word + " ",
        wordsPlayed: this.state.wordsPlayed + 1,
        wordSet: this.state.wordSet.add(this.state.word),
        score: this.state.score + this.calculateWordScore(this.state.word),
        seconds: this.state.seconds + this.state.word.length * 2,
      });
      this.clearWord();
      // Run validation for if the played word is the longest possible word, if it is the game ends and next round starts
      if (this.state.word === this.state.startingWord) {
        this.goodEnding();
      }
    } else {
      this.setState({
        errorMessage: "Uh oh! That word has already been played.",
      });
    }
  }

  async validateWord() {
    if (!this.state.gameOver) {
      
    const inputedWord = this.state.word;

    const call = await axios.get(
      "http://localhost:5000/api/validateWord/" + inputedWord
    );
    if (!call["data"]["error"]) {
      if (call["data"]["definitions"]) {
        this.setState({
          wordDefinition: call["data"]["definitions"].definition,
        });
        this.submitWord();
      } else {
        this.setState({
          errorMessage:
            "Word exists but there is no definition. No points. Try Again Dumbass",
        });
      }
    } else {
      this.setState({ errorMessage: "Word does not exist" });
    }
    
      this.submitWord();
    } else {
      this.setState({
        mascotDialogue:
          "The game is already over! Click Reset to start a new game!",
      });
    }
  }
  
  async getHighScores(){
    var scores = await axios.get('http://localhost:5000/api/getAllUsers');
    var userScores = [];
    for(let i = 0; i < scores['data'].length; i++){
      userScores.push(scores['data'][i]);
    }
    this.setState({highScores : userScores});

  }

  calcTime(sec) {
    let minDivisor = sec % (60 * 60);
    let minutes = Math.floor(minDivisor / 60);
    let secDivisor = minDivisor % 60;
    let seconds = Math.ceil(secDivisor);

    let timObj = {
      M: minutes + "",
      S: (seconds + "").padStart(2, "0"), //if less than 2 characters adds a 0 to the front
    };
    return timObj;
  }

  startTimer() {
    if (this.timer === 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.calcTime(seconds), //updates time display
      seconds: seconds,
    });

    if (seconds === 0) {
      // Shoot
      this.setState({ mascotSrc: "../thesaurusrex-2.png" });
      clearInterval(this.timer); // stops timer
      this.timer = 0;
      this.badEnding();
    } else if (
      seconds <= 10 &&
      this.state.mascotSrc !== "../thesaurusrex-1.png"
    ) {
      // Look
      this.setState({
        mascotSrc: "../thesaurusrex-1.png",
        mascotDialogue: "10 seconds left!",
      });
    } else if (
      seconds <= 20 &&
      this.state.mascotSrc !== "../thesaurusrex.png"
    ) {
      // Gun
      this.setState({
        mascotSrc: "../thesaurusrex.png",
        mascotDialogue: "20 seconds left!",
      });
    } else if (seconds > 20 && this.state.mascotSrc !== "../mascot.png") {
      // Put Gun Away
      this.setState({
        mascotSrc: "../mascot.png",
        mascotDialogue: "Safe....for now",
      });
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = 0;
  }

  resetTimer() {
    this.setState({
      seconds: startingRoundLength,
      timer: 0,
      time: this.calcTime(startingRoundLength),
      gameOver: false,
    });
    clearInterval(this.timer);
    this.timer = 0;
  }

  render() {
    return (
      <div className="RowTray" id="GameContainer">
        <div className="SideColumn">
          <Mascot
            dialogue={this.state.mascotDialogue}
            src={this.state.mascotSrc}
          />
          <Options />
          <button onClick={this.reset}>Reset Game</button>
        </div>
        <div className="CenterColumn">
          <div>
            <h1>Dictionary Attack!</h1>
            <div className="RowTray">
              {/* displays minutes and seconds */}
              <h3>Time: {this.state.time.M + ":" + this.state.time.S}</h3>
              <h3>Score: {this.state.score}</h3>
            </div>
            <p>{this.state.errorMessage}</p>
          </div>
          {/* <WordBox currentWord={this.state.word} /> */}
          <WordLine letters={this.state.wordDisplay} />
          <div className="LetterBox">{this.state.letterTray}</div>
          <div className="RowTray">
            <BigButton content="Submit" handleClick={this.validateWord} />
            <BigButton content="Clear" handleClick={this.clearWord} />
          </div>
        </div>
        <div className="SideColumn">
          <WordList wordlist={this.state.wordList} />
          <HighScores highScores={this.state.highScores}/>
        </div>
      </div>
    );
  }
}

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
        <pre>{list}</pre>
      </div>
    );
  }
};

const Mascot = (props) => {
  return (
    <div id="MascotBox" className="SidebarBox">
      <img
        src={props.src}
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
      <table>
        <tr>
          <th>Username</th>
          <th>Highscore</th>
          <th>Time</th>
        </tr>
          {  props.highScores  ? (
                props.highScores.map((user) => (
                  <tr>
                    <th>{user.username}</th>
                    <th>{user.highscore}</th>
                    <th>{user.time}</th>
                  </tr>
                ))
                ):(
                
                  <div>No High Scores Yet</div>
                ) 
              }
        </table>
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
