import React from "react";
import "./components.css";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      wordList: "",
      wordsPlayed: 0,
      time: {}, //the timer
      seconds: 90, //number of seconds to be turned into minutes / seconds
    };
    this.addLetter = this.addLetter.bind(this);
    this.clearWord = this.clearWord.bind(this);
    this.submitWord = this.submitWord.bind(this);
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.countDown = this.countDown.bind(this);
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

  calcTime(sec) {
    let minDivisor = sec % (60 * 60);
    let minutes = Math.floor(minDivisor / 60);
    let secDivisor = minDivisor % 60;
    let seconds = Math.ceil(secDivisor);

    let timObj = {
      M: minutes,
      S: seconds,
    };
    return timObj;
  }

  componentDidMount() {
    let timeLeftVar = this.calcTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
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
      clearInterval(this.timer); // stops timer
      this.timer = 0;
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.timer = 0;
  }

  resetTimer() {
    this.setState({ seconds: 90, timer: 0, time: this.calcTime(90) });
    clearInterval(this.timer);
    this.timer = 0;
  }

  render() {
    return (
      <div className="RowTray" id="GameContainer">
        <div className="SideColumn">
          <Mascot dialogue="Welcome to Dictionary Attack!" />
          <Options />
        </div>
        <div className="CenterColumn">
          <h1>Dictionary Attack!</h1>
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
          {/* button to start timer */}
          <button onClick={this.startTimer}>Start</button>
          {/* button to stop timer */}
          <button onClick={this.stopTimer}>Stop</button>
          {/* button to reset timer */}
          <button onClick={this.resetTimer}>Reset</button>
          {/* displays minutes and seconds */}
          {this.state.time.M} M {this.state.time.S} S
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

// calcTime(sec){
//   let minDivisor = sec % (60 * 60);
//   let minutes = Math.floor(minDivisor / 60);
//   let secDivisor = minDivisor % 60;
//   let seconds = Math.ceil(secDivisor);

//   let timObj = {
//     M: minutes,
//     S: seconds,
//   };
//   return timObj;
// };

// componentDidMount(){
//   let timeLeftVar = this.calcTime(this.state.seconds);
//   this.setState({ time: timeLeftVar });
// };

// startTimer() {
//   if (this.timer == 0 && this.state.seconds > 0) {
//     this.timer = setInterval(this.countDown, 1000);
//   }
// };

// countDown() {
//   let seconds = this.state.seconds - 1;
//   this.setState({
//     time: this.calcTime(seconds),
//     seconds: seconds,
//   });

//   if (seconds == 0) {
//     clearInterval(this.timer);
//   }
// };

// const Time = (props) => {
//   return (
//     <div>
//       <button onClick={this.startTimer}>Start</button>
//       M: {this.state.time.M} S: {this.state.time.s}
//     </div>
//   );
// };

export default Game;
