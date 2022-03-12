/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// global variables
var pattern = [];
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var guessCounter = 0;
// global constants
const volume = 0.5;
const clueHoldTime = 1000;
const cluePauseTime = 333;
const nextClueWaitTime = 1000;

// Code for generating pattern
function createPattern() {
  for (let i = 0; i < 8; i++) {
    pattern.push(Math.floor(Math.random() * (9 - 1)) + 1);
  }
  return pattern;
}

// start game function
function startGame() {
  pattern = createPattern();
  console.log(pattern);
  progress = 0;
  gamePlaying = true;

  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}
// stop game function
function stopGame() {
  gamePlaying = false;

  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

// lighting and clearing game buttons
function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  let delay = nextClueWaitTime;
  for (let i = 0; i <= progress; i++) {
    console.log("play single clue: " + pattern[i] + " in " + delay + " ms.");
    setTimeout(playSingleClue, delay, pattern[i]);
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

// guess function. keeps track of players guess
function guess(btn) {
  console.log("user guessed: " + btn);
  console.log(guessCounter);
  console.log(progress);

  if (!gamePlaying) {
    return;
  }

  // this code check increments the score.
  // if the player won a message is displayed and the score and pattern array is reset
  // is the player loses a message is displayed and the score and pattern array is reset
  if (btn == pattern[guessCounter]) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
        pattern = [];
        document.getElementById("score").innerHTML = "";
      } else {
        progress++;
        document.getElementById("score").innerHTML = progress;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    loseGame();
    pattern = [];
    document.getElementById("score").innerHTML = "";
  }
}

// lose game function
function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}
// win game function
function winGame() {
  stopGame();
  alert("Game Over. You Won!");
}

// Sound Synthesis Functions
const freqMap = {
  1: 200.5,
  2: 230.5,
  3: 261.6,
  4: 329.6,
  5: 392,
  6: 466.2,
  7: 490.5,
  8: 530.5,
  9: 580.5,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);