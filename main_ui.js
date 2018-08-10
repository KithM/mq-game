function createProblemMenu(){
	let more = document.getElementById(`more`);
	more.innerHTML = ``;

	// Title
	let title = document.createElement(`button`);
	title.innerHTML = `No Variable<vr></vr>`;
	title.style.display = `table`;
	title.style.padding = `8px 8px 6px 8px`;
	title.style.margin = `-15px`;
	title.style.fontWeight = `normal`;
	title.style.fontSize = `18px`;
	let b = document.createElement(`b`);
	b.innerHTML = `...`;
	b.className = `morebutton`;
	title.appendChild(b);
	more.appendChild(title);

	// The Problem
	let pspan = document.createElement(`span`);
	pspan.style.lineHeight = `42px`;
	pspan.style.fontSize = `${22-Math.round(Problem.problem.length/22)}px`;
	let prob = Problem.problem
	.replace(/ (\*) /gmi,` <span class="">&times;</span> `)
	.replace(/ (\+) /gmi,` <span class="">&plus;</span> `)
	.replace(/ (\/) /gmi,` <span class="">/</span> `) //&#8260
	.replace(/ (\-) /gmi,` <span class="">&minus;</span> `)
	.replace(/ (\%) /gmi,` <span class="">&#37;</span> `);
	pspan.innerHTML = `${prob}`;
	more.appendChild(pspan);

	more.appendChild(document.createElement(`br`));

	// Equal Sign
	let equals = document.createElement(`span`);
	equals.innerHTML = `=`;
	equals.style.marginLeft = `-20px`;
	if(Problem.variable){
		equals.innerHTML = `${Problem.variable} =`;
		equals.style.marginLeft = `-48px`;
	}
	equals.style.fontSize = `32px`;
	equals.style.marginRight = `5px`;
	equals.style.display = `inline-block`;
	equals.style.transform = `translate(0px, 2px)`;
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
	opdd.onclick = function(){ toggleOptionsMenu(); };
	opdd.style.fontSize = `20px`;
	let opddb = document.createElement(`b`);
	opddb.innerHTML = `...`;
	opddb.className = `morebutton`;
	opddb.style.fontSize = `24px`;
	opdd.appendChild(opddb);
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
			clearInterval(__ProblemTimeInterval);
			Highscores.problems.push(Problem);

			let totalatt = 0;
			let totaltime = 0;
			for (var i = 0; i < Highscores.problems.length; i++) {
				totalatt += Highscores.problems[i].tries;
				totaltime += Highscores.problems[i].time;
			}
			Highscores.averageAttempts = numberToDecimalNumber(totalatt / Highscores.problems.length,1);
			Highscores.averageTime = numberToDecimalNumber(totaltime / Highscores.problems.length,1);

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
				let defval = ans.placeholder;
				if(Problem.tries > 24 && Problem != simplifyMathProblem(Problem)){
					Problem = simplifyMathProblem(Problem);
					createProblemMenu();
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
	stats_title.style.margin = `10px`;
	stats.appendChild(stats_title);

	let tries = document.createElement(`span`);
	tries.className = `stat`;
	tries.innerHTML = `Attempts: <statbox>${Problem.tries}</statbox>`;
	stats.appendChild(tries);

	stats.appendChild(document.createElement(`vr`));

	let time = document.createElement(`span`);
	time.className = `stat`;
	time.innerHTML = `Time: <statbox>${Problem.time}s</statbox>`;
	stats.appendChild(time);

	stats.appendChild(document.createElement(`br`));

	let average_attempts = document.createElement(`span`);
	average_attempts.className = `stat`;
	average_attempts.innerHTML = `Average Attempts: <statbox>${Highscores.averageAttempts}</statbox>`;
	stats.appendChild(average_attempts);

	stats.appendChild(document.createElement(`vr`));

	let average_time = document.createElement(`span`);
	average_time.className = `stat`;
	average_time.innerHTML = `Average Time: <statbox>${Highscores.averageTime}s</statbox>`;
	stats.appendChild(average_time);

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
	levels_title.style.margin = `10px`;
	levels_title.innerHTML = `<big>Levels:</big>`;
	stats.appendChild(levels_title);

	let add = document.createElement(`span`);
	add.className = `stat`;
	add.innerHTML = `Addition: <statbox style=border-color:${getStatBoxColor(Levels.addition)}>${Levels.addition}</statbox>`;
	stats.appendChild(add);

	stats.appendChild(document.createElement(`vr`));

	let sub = document.createElement(`span`);
	sub.className = `stat`;
	sub.innerHTML = `Subtraction: <statbox style=border-color:${getStatBoxColor(Levels.subtraction)}>${Levels.subtraction}</statbox>`;
	stats.appendChild(sub);

	stats.appendChild(document.createElement(`br`));

	let mul = document.createElement(`span`);
	mul.className = `stat`;
	mul.innerHTML = `Multiplication: <statbox style=border-color:${getStatBoxColor(Levels.multiplication)}>${Levels.multiplication}</statbox>`;
	stats.appendChild(mul);

	stats.appendChild(document.createElement(`vr`));

	let div = document.createElement(`span`);
	div.className = `stat`;
	div.innerHTML = `Division: <statbox style=border-color:${getStatBoxColor(Levels.division)}>${Levels.division}</statbox>`;
	stats.appendChild(div);

	stats.appendChild(document.createElement(`br`));

	let mod = document.createElement(`span`);
	mod.className = `stat`;
	mod.innerHTML = `Modulo: <statbox style=border-color:${getStatBoxColor(Levels.modulo)}>${Levels.modulo}</statbox>`;
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
	difftext.innerHTML = `Difficulty: ${Problem.difficulty}`;
	opm.appendChild(difftext);
	let inputdiff = document.createElement(`input`); // <input type="text" name="answer"></input>
	inputdiff.type = `range`;
	inputdiff.min = `1`;
	inputdiff.max = `9`;
	inputdiff.name = `difficulty`;
	inputdiff.id = `difficulty`;
	inputdiff.defaultValue = Problem.difficulty;
	inputdiff.style.height = `5px`;
	inputdiff.style.width = `25%`;
	inputdiff.onmouseup = function(){ let inputdiff = document.getElementById(`difficulty`); if(inputdiff.value != Problem.difficulty){ createNewProblem(inputdiff.value); toggleOptionsMenu(); } };
	opm.appendChild(inputdiff);

	opm.appendChild(document.createElement(`br`));

	let diffinfo = document.createElement(`p`);
	diffinfo.className = `stat`;
	diffinfo.style = `padding: 4px; border: 2px solid #363636; border-radius: 4px; font-size: 10px; width: 60%; left: 50%; display: inline-block;`;
	if(inputdiff.value == 1){
		diffinfo.innerHTML = `Addition and subtraction problems using the values 0 to 8. Generates 2 to 3 numbers.`;
	} else if(inputdiff.value == 2){
		diffinfo.innerHTML = `Addition and subtraction problems using the values -6 to 12. Generates 2 to 5 numbers.`;
	} else if(inputdiff.value == 3){
		diffinfo.innerHTML = `Addition, subtraction, and multiplication problems using the values -10 to 20. Generates 2 to 5 numbers.`;
	} else if(inputdiff.value == 4){
		diffinfo.innerHTML = `Addition, subtraction, and multiplication problems using the values -12 to 24. Generates 3 to 5 numbers.`;
	} else if(inputdiff.value == 5){
		diffinfo.innerHTML = `Addition, subtraction, and multiplication problems using the values -24 to 42. Generates 4 to 5 numbers.`;
	} else if(inputdiff.value == 6){
		diffinfo.innerHTML = `Addition, subtraction, multiplication, and division problems using the values -42 to 42. Generates 4 to 6 numbers.`;
	} else if(inputdiff.value == 7){
		diffinfo.innerHTML = `Addition, subtraction, multiplication, and division problems using the values -42 to 86. Generates 4 to 7 numbers.`;
	} else if(inputdiff.value == 8){
		diffinfo.innerHTML = `Addition, subtraction, multiplication, division, and modulo problems using the values -86 to 86. Generates 5 to 7 numbers.`;
	} else if(inputdiff.value == 9){
		diffinfo.innerHTML = `Addition, subtraction, multiplication, division, and modulo problems using the values -100 to 100. Generates 5 to 8 single-decimal numbers.`;
	}
	//diffinfo.style.float = `right`;
	opm.appendChild(diffinfo);
}
