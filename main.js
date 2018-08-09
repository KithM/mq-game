// Game
var Highscores = { difficulty:0, complexity:0, averageAttempts:0, problems:[] };
var Levels = { addition:0, subtraction:0, multiplication:0, division:0, modulo:0 };

// Problem
var Problem;

// System
function setup() {
	createCanvas(0,0);
	createNewProblem(1);
}
function draw() {
}
function createNewProblem(difficulty){
	Problem = generateMathProblem(difficulty);
	createProblemMenu();
}
