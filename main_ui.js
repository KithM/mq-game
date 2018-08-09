function createProblemMenu(){
	let more = document.getElementById(`more`);
	more.innerHTML = ``;

	// The Problem
	let pspan = document.createElement(`span`);
	pspan.style.fontSize = `22px`;
	let prob = Problem.problem
	.replace(/ (\*) /gmi,` <span class="multiplication">&times;</span> `)
	.replace(/ (\+) /gmi,` <span class="addition">&plus;</span> `)
	.replace(/ (\/) /gmi,` <span class="division">/</span> `) //&#8260
	.replace(/ (\-) /gmi,` <span class="subtraction">&minus;</span> `)
	.replace(/ (\%) /gmi,` <span class="modulo">&#37;</span> `);
	pspan.innerHTML = `${prob}`;
	more.appendChild(pspan);

	more.appendChild(document.createElement(`br`));

	// Equal Sign
	let equals = document.createElement(`span`);
	equals.innerHTML = `=`;
	equals.style.fontSize = `42px`;
	equals.style.marginRight = `5px`;
	equals.style.marginLeft = `-25px`;
	equals.style.display = `inline-block`;
	equals.style.transform = `translate(0px, 5px)`;
	more.appendChild(equals);

	// Input
	let inputbox = document.createElement(`input`); // <input type="text" name="answer"></input>
	inputbox.type = `number`;
	inputbox.name = `answer`;
	inputbox.id = `answer`;
	inputbox.autocomplete = `off`;
	inputbox.placeholder = `Enter solution...`;
	inputbox.style.fontSize = `18px`;
	more.appendChild(inputbox);

	// Solution Check
	let iscorrect = document.createElement(`solution`);
	iscorrect.id = `solution`;
	iscorrect.className = `hide`;
	iscorrect.style.fontSize = inputbox.style.fontSize;
	more.appendChild(iscorrect);

	more.appendChild(document.createElement(`br`));

	// Difficulty & Complexity Bar
	let diffcom = document.createElement(`div`);
	let diff = document.createElement(`span`);
	let com = document.createElement(`span`);
	let diff_bar = document.createElement(`statbox`);
	let com_bar = document.createElement(`statbox`);
	diffcom.style.marginTop = `5px`;
	diff.innerHTML = `Difficulty: `;
	diff.className = `stat`;
	com.innerHTML = `Complexity: `;
	com.className = `stat`;

	diff_bar.innerHTML = `${Problem.difficulty}`;
	com_bar.innerHTML = `${Problem.complexity}`;

	diff.appendChild(diff_bar);
	com.appendChild(com_bar);
	diffcom.appendChild(diff);
	diffcom.appendChild(document.createElement(`vr`));
	diffcom.appendChild(com);
	more.appendChild(diffcom);

	// Stats Menu
	let stats = document.createElement(`div`);
	stats.className = `more`;
	stats.id = `stats`;
	more.appendChild(stats);

	// New Problem Button
	let newprob = document.createElement(`button`);
	newprob.className = `green`;
	newprob.style.marginTop = `15px`;
	newprob.style.fontSize = `20px`;
	newprob.innerHTML = `New Problem`;
	newprob.onclick = function(){ createNewProblem(Problem.difficulty); };
	more.appendChild(newprob);

	let opdd = document.createElement(`button`);
	opdd.className = ``;
	opdd.style.fontSize = `20px`;
	opdd.innerHTML = `...`; //transform:rotate(90deg);
	opdd.onclick = function(){ toggleOptionsMenu(); };
	more.appendChild(opdd);

	// Options Menu
	let opm = document.createElement(`div`);
	opm.id = `options`;
	opm.className = `more hide`;
	more.appendChild(opm);

	// JQuery
	// Check the input as a solution to the current problem
	var timeout = null;
	$('#answer').keyup(function(event) {
		let sol = document.getElementById(`solution`);
		let ans = document.getElementById(`answer`);
		if(isNearSolution(ans.value)){ //solveMathProblem(Problem)
			if(ans.value == `` || isNaN(ans.value) || ans.readOnly == `true`){ return; }
			$(this).off(event);

			ans.readOnly = `true`;
			sol.className = `correct`;
			sol.innerHTML = `✔<vr></vr>Correct`;

			if(Problem.difficulty > Highscores.difficulty){	Highscores.difficulty = Problem.difficulty; }
			if(Problem.complexity > Highscores.complexity){	Highscores.complexity = Problem.complexity;	}
			Highscores.problems.push(Problem);

			let totalatt = 0;
			let avgatt = 0;
			for (var i = 0; i < Highscores.problems.length; i++) {
				totalatt += Highscores.problems[i].tries;
			}
			avgatt = numberToDecimalNumber(totalatt / Highscores.problems.length,1);
			Highscores.averageAttempts = avgatt;

			let pts = Math.round((Problem.complexity/2.5)+0.5/Problem.difficulty);//Math.floor((Problem.complexity/2.5)+0.5/Problem.difficulty) / (Problem.tries/5);
			let add = Problem.problem.match(/(\+)/gmi);
			if(add)
			Levels.addition += Math.round(pts*add.length);

			let sub = Problem.problem.match(/(\-)/gmi)
			if(sub)
			Levels.subtraction += Math.round(pts*sub.length);

			let mul = Problem.problem.match(/(\*)/gmi);
			if(mul)
			Levels.multiplication += Math.round(pts*mul.length);

			let div = Problem.problem.match(/(\/)/gmi);
			if(div)
			Levels.division += Math.round(pts*div.length);

			let mod = Problem.problem.match(/(\%)/gmi);
			if(mod)
			Levels.modulo += Math.round(pts*mod.length); //Math.max(Problem.complexity-mod.length,0)

			createStatsMenu();
		} else {
			sol.className = `incorrect`;
			if(ans.value != null && ans.value != ``){
				sol.innerHTML = `❌`;
			} else {
				sol.className = `hide`;
			}

			timeout = setTimeout(function(){
				let sol = document.getElementById(`solution`);
				let ans = document.getElementById(`answer`);
				Problem.tries = Problem.tries+1;
				if(Problem.tries > 9){
					if(Problem.problem != simplifyMathProblem(Problem).problem){
						// Problem = simplifyMathProblem(Problem);
						// createProblemMenu();
					}
				}
			}, 250);
		}
	});
	// Create a new problem when Enter is pressed
	$(document).keypress(function(k) {
		let sol = document.getElementById(`solution`);
		if(k.key == `Enter` && sol.className == `correct`)
		createNewProblem(Problem.difficulty);
	});
	// Replace division symbol and format as a fraction
	$('.fraction').each(function(key, value) {
		$this = $(this);
		var split = $this.html().split("/");
		if( split.length == 2 ){
			$this.html('<span class="top">'+split[0]+'</span><span class="bottom">'+split[1]+'</span>');
		}
	});
}
function createStatsMenu(){
	let stats = document.getElementById(`stats`);
	stats.innerHTML = ``;

	stats.appendChild(document.createElement(`hr`));

	let stats_title = document.createElement(`div`);
	stats_title.innerHTML = `<big>Stats:</big>`;
	stats.appendChild(stats_title);

	let tries = document.createElement(`span`);
	tries.className = `stat`;
	tries.innerHTML = `Attempts: <statbox>${Problem.tries}</statbox>`;
	stats.appendChild(tries);

	stats.appendChild(document.createElement(`vr`));

	let average_attempts = document.createElement(`span`);
	average_attempts.className = `stat`;
	average_attempts.innerHTML = `Average Attempts: <statbox>${Highscores.averageAttempts}</statbox>`;
	stats.appendChild(average_attempts);

	stats.appendChild(document.createElement(`br`));

	let highscore_difficulty = document.createElement(`span`);
	highscore_difficulty.className = `stat`;
	highscore_difficulty.innerHTML = `Highest Difficulty: <statbox>${Highscores.difficulty}</statbox>`;
	stats.appendChild(highscore_difficulty);

	stats.appendChild(document.createElement(`vr`));

	let highscore_complexity = document.createElement(`span`);
	highscore_complexity.className = `stat`;
	highscore_complexity.innerHTML = `Highest Complexity: <statbox>${Highscores.complexity}</statbox>`;
	stats.appendChild(highscore_complexity);

	stats.appendChild(document.createElement(`hr`));

	// LEVELS
	let levels_title = document.createElement(`div`);
	levels_title.innerHTML = `<big>Levels:</big>`;
	stats.appendChild(levels_title);

	let add = document.createElement(`span`);
	add.className = `stat`;
	add.innerHTML = `Addition: <statbox>${Levels.addition}</statbox>`;
	stats.appendChild(add);

	stats.appendChild(document.createElement(`vr`));

	let sub = document.createElement(`span`);
	sub.className = `stat`;
	sub.innerHTML = `Subtraction: <statbox>${Levels.subtraction}</statbox>`;
	stats.appendChild(sub);

	stats.appendChild(document.createElement(`br`));

	let mul = document.createElement(`span`);
	mul.className = `stat`;
	mul.innerHTML = `Multiplication: <statbox>${Levels.multiplication}</statbox>`;
	stats.appendChild(mul);

	stats.appendChild(document.createElement(`vr`));

	let div = document.createElement(`span`);
	div.className = `stat`;
	div.innerHTML = `Division: <statbox>${Levels.division}</statbox>`;
	stats.appendChild(div);

	stats.appendChild(document.createElement(`br`));

	let mod = document.createElement(`span`);
	mod.className = `stat`;
	mod.innerHTML = `Modulo: <statbox>${Levels.modulo}</statbox>`;
	stats.appendChild(mod);

	stats.appendChild(document.createElement(`hr`));
}
function toggleOptionsMenu(){
	let opm = document.getElementById(`options`);
	if(opm.className == `more show`){
		opm.className = `more hide`;
	} else if (opm.className == `more hide`){
		opm.className = `more show`;
		createOptionsMenu();
	}
}
function createOptionsMenu(){
	let opm = document.getElementById(`options`);
	opm.innerHTML = ``;

	let difftext = document.createElement(`div`);
	difftext.innerHTML = `Difficulty: `;
	opm.appendChild(difftext);
	let inputdiff = document.createElement(`input`); // <input type="text" name="answer"></input>
	inputdiff.type = `range`;
	inputdiff.min = `1`;
	inputdiff.max = `5`;
	inputdiff.name = `difficulty`;
	inputdiff.id = `difficulty`;
	inputdiff.defaultValue = Problem.difficulty;
	inputdiff.style.height = `5px`;
	inputdiff.style.width = `25%`;
	inputdiff.onmouseleave = function(){ let inputdiff = document.getElementById(`difficulty`); if(inputdiff.value != Problem.difficulty){ createNewProblem(inputdiff.value); toggleOptionsMenu(); } };
	opm.appendChild(inputdiff);
}
