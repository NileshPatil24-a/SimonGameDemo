var buttonColours = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];

var started = false;
var level = 0;
var timeLimit = 60000; // 1 minute in milliseconds
var timer; // To store the timeout ID
var timerInterval; // For updating the time left
var timeLeft = timeLimit; // Remaining time in milliseconds

var alertSound = new Audio("alarm-alert-sound-effect-230557.mp3");
var sounds = {
  red: "sounds/red.mp3",
  blue: "sounds/blue.mp3",
  green: "sounds/green.mp3",
  yellow: "sounds/yellow.mp3",
};

// Start game on keypress
$(document).keypress(function () {
  if (!started) {
    resetGame();
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
    startTimer();
  }
});

// Handle button clicks
$(".btn").click(function () {
  if (!started) return;

  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  userFlash($(this));
  playSound(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

// Check user's answer
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(nextSequence, 1000);
    }
  } else {
    wrongSequence();
  }
}

// Generate the next sequence
function nextSequence() {
  userClickedPattern = [];
  level++;
  $("#level-title").text("Level " + level);

  var randomNumber = Math.floor(Math.random() * buttonColours.length);
  var randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  gameFlash($("#" + randomChosenColour));
  playSound(randomChosenColour);
}

// Add user click animation
function userFlash(button) {
  button.addClass("pressed");
  setTimeout(() => button.removeClass("pressed"), 250);
}

// Add game sequence animation
function gameFlash(button) {
  button.fadeOut(100).fadeIn(100).addClass("gameflash");
  setTimeout(() => button.removeClass("gameflash"), 250);
}

// Play sound for a given color
function playSound(name) {
  var audio = new Audio(sounds[name]);
  audio.play();
}

// Handle wrong sequence
function wrongSequence() {
  playAlertSound();

  // Stop the timer
  clearTimeout(timer);
  clearInterval(timerInterval);

  $("body").addClass("game-over");
  $("#level-title").html(
    `Wrong Sequence! Your Score: <b>${level - 0}</b><br>Press Any Key to Restart`
  );
  setTimeout(() => $("body").removeClass("game-over"), 200);

  // Wait for keypress to restart
  $(document).one("keypress", function () {
    resetGame();
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
    startTimer();
  });
}

// Play alert sound
function playAlertSound() {
  alertSound.pause();
  alertSound.currentTime = 0;
  alertSound.play();
}

// Restart the game
function startOver() {
  resetTimer();
  resetGame();
}

// Reset game variables
function resetGame() {
  gamePattern = [];
  level = 0;
  started = false;
  clearTimeout(timer);
  clearInterval(timerInterval);
  updateTimerDisplay(timeLimit / 1000); // Reset timer display
}

// Start the game timer
function startTimer() {
  timeLeft = timeLimit;
  clearTimeout(timer);
  clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft -= 1000;
    updateTimerDisplay(timeLeft / 1000); // Update the display every second

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeUp();
    }
  }, 1000);

  timer = setTimeout(() => {
    timeUp();
  }, timeLimit);
}

// Update the timer display
function updateTimerDisplay(seconds) {
  $("#timer").text(seconds + "s");
}

// Handle time up scenario
function timeUp() {
  playAlertSound();
  $("body").addClass("game-over");
  $("#level-title").html(
    `Time's Up! Your Score: <b>${level}</b><br>Press Any Key to Restart`
  );
  setTimeout(() => $("body").removeClass("game-over"), 200);

  // Wait for keypress to restart
  $(document).one("keypress", function () {
    resetGame();
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
    startTimer();
  });
}
