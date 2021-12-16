import React from "react";
import "./components.css";
import axios from "axios";

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: "",
      wordList: "",
      wordsPlayed: 0,
      score: 0,
      wordSet: new Set(),
      errorMessage: "",
      mascotDialogue: "Welcome to Dictionary Attack!",
      wordDefinition: ""
    };
    this.addLetter = this.addLetter.bind(this);
    this.clearWord = this.clearWord.bind(this);
    this.submitWord = this.submitWord.bind(this);
    this.validateWord = this.validateWord.bind(this);
  }

  addLetter(letter) {
    this.setState({ word: this.state.word + letter, errorMessage: "" });
  }

  clearWord() {
    this.setState({ word: "", errorMessage: "" });
  }

  goodEnding() {
    this.setState({ mascotDialogue: "Nice job!" });
  }

  submitWord() {
    /* link to word validation backend here */
    if (true) {
      // The word is valid, check if it has already been played
      if (!this.state.wordSet.has(this.state.word)) {
        // The word is not in the played words, add to word list and increment words played
        this.setState({
          wordList: this.state.wordList + this.state.word + " ",
          wordsPlayed: this.state.wordsPlayed + 1,
          wordSet: this.state.wordSet.add(this.state.word),
        });
        // Run validation for if the played word is the longest possible word, if it is the game ends and next round starts
        if (true) {
          this.goodEnding();
        }
      } else {
        this.setState({
          errorMessage: "Uh oh! That word has already been played.",
        });
      }
    } 
  }

  async validateWord(){
    const inputedWord = this.state.word;
    const call = await axios.get("http://localhost:5000/api/validateWord/" + inputedWord);
    if(!call['data']['error']){
      if(call['data']['definitions']){
        this.setState({wordDefinition: call['data']['definitions'].definition});
        this.submitWord();
      }else{
        this.setState({errorMessage: "Word exists but there is no definition. No points. Try Again Dumbass"})
      }
     
    }
    else{
      this.setState({errorMessage: "Word does not exist"})
    }
    
    console.log(call);
  }





  render() {
    return (
      <div className="RowTray" id="GameContainer">
        <div className="SideColumn">
          <Mascot dialogue={this.state.mascotDialogue} />
          <Options />
        </div>
        <div className="CenterColumn">
          <h1>Dictionary Attack!</h1>
          <WordBox currentWord={this.state.word} />
          <p> {this.state.errorMessage}</p>
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
            <BigButton content="Submit" handleClick={this.validateWord} />
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
