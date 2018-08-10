// Game
var Highscores = { difficulty:0, complexity:0, averageAttempts:0, averageTime:0, problems:[] };
var Levels = { addition:0, subtraction:0, multiplication:0, division:0, modulo:0 };

// Problem
var Problem;

// Misc
var __ProblemTimeInterval;

// System
function setup() {
	createCanvas(0,0);
	createNewProblem(1);
}
function draw() {
}
function createNewProblem(difficulty){
	Problem = generateMathProblem(difficulty);

	if(__ProblemTimeInterval){ clearInterval(__ProblemTimeInterval); }
	__ProblemTimeInterval = setInterval(function(){ Problem.time++; },1000);

	createProblemMenu();

	document.getElementById(`answer`).autofocus = `autofocus`;
	document.getElementById(`answer`).select();
}
