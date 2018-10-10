// Game
var Highscores = { difficulty:0, complexity:0, averageAttempts:0, averageTime:0 };

// Scoring
var Grades = { addition:0, subtraction:0, multiplication:0, division:0, modulo:0 };
var Points = { addition:0, subtraction:0, multiplication:0, division:0, modulo:0 };
// Settings
var Options = { maxTries:5 };

// Completed Problems
var Problems = { list:[],
	addition:{ points:0 },
	subtraction:{ points:0 },
	multiplication:{ points:0 },
	division:{ points:0 },
	modulo:{ points:0 }
};
// Current Problem
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
	Problems.list.push(Problem);

	if(__ProblemTimeInterval){ clearInterval(__ProblemTimeInterval); }
	__ProblemTimeInterval = setInterval(function(){ Problem.time++; },1000);

	createProblemMenu();

	document.getElementById(`answer`).autofocus = `autofocus`;
	document.getElementById(`answer`).select();
}
function generateGradeLevels(){
	let pts = Problem.points;
	if(Problem.problem.match(/(\+)/gmi)){
		Problems.addition.points += pts;
		Problems.addition.points = numberToDecimalNumber(Problems.addition.points,1);
	}
	if(Problem.problem.match(/(\-)/gmi)){
		Problems.subtraction.points += pts;
		Problems.subtraction.points = numberToDecimalNumber(Problems.subtraction.points,1);
	}
	if(Problem.problem.match(/(\*)/gmi)){
		Problems.multiplication.points += pts;
		Problems.multiplication.points = numberToDecimalNumber(Problems.multiplication.points,1);
	}
	if(Problem.problem.match(/(\/)/gmi)){
		Problems.division.points += pts;
		Problems.division.points = numberToDecimalNumber(Problems.division.points,1);
	}
	if(Problem.problem.match(/(\%)/gmi)){
		Problems.modulo.points += pts;
		Problems.modulo.points = numberToDecimalNumber(Problems.modulo.points,1);
	}
	Problems.list.push(Problem);

	Grades.addition = Math.round((Points.addition / Problems.addition.points)*100);
	if(isNaN(Grades.addition)){
		Grades.addition = 100;
	}
	Grades.subtraction = Math.round((Points.subtraction / Problems.subtraction.points)*100);
	if(isNaN(Grades.subtraction)){
		Grades.subtraction = 100;
	}
	Grades.multiplication = Math.round((Points.multiplication / Problems.multiplication.points)*100);
	if(isNaN(Grades.multiplication)){
		Grades.multiplication = 100;
	}
	Grades.division = Math.round((Points.division / Problems.division.points)*100);
	if(isNaN(Grades.division)){
		Grades.division = 100;
	}
	Grades.modulo = Math.round((Points.modulo / Problems.modulo.points)*100);
	if(isNaN(Grades.modulo)){
		Grades.modulo = 100;
	}

	console.log(Grades.addition);
}
