function createProblemMenu(){
	let more = document.getElementById(`more`);
	more.innerHTML = ``;

	// Menu Selector
	let mstitle = document.createElement(`button`);
	mstitle.innerHTML = `No Variable<vr></vr>`;
	mstitle.id = `ms`;
	mstitle.style.position = `absolute`;
	mstitle.style.zIndex = `2`;
	mstitle.style.margin = `-15px`;
	mstitle.style.fontSize = `20px`;
	mstitle.style.left = `25px`;
	mstitle.onclick = toggleDropDown;
	mstitle.className = `dropdown dropbtn blue`;
	let mstitleb = document.createElement(`b`);
	mstitleb.innerHTML = `...`;
	mstitleb.className = `morebutton`;
	mstitleb.style.fontSize = `24px`;
	mstitle.appendChild(mstitleb);
	more.appendChild(mstitle);

	// Menu Selector Options
	let msoptions = document.createElement(`div`);
	msoptions.className = `dropdown-content`;
	msoptions.id = `myDropdown`;
	mstitle.appendChild(msoptions);

	let msoptions_a = document.createElement(`a`);
	msoptions_a.innerHTML = `Menu Option A`;
	msoptions.appendChild(msoptions_a);

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
	$('#answer').keypress(function(k, event) {
		let sol = document.getElementById(`solution`);
		let ans = document.getElementById(`answer`);
		if(k.key != `Enter`){
			return;
		}
		if(ans.value == `` || isNaN(ans.value) || ans.readOnly == `true`){ return; }
		if(isNearSolution(ans.value)){ //solveMathProblem(Problem)
			$(this).off(event);

			ans.readOnly = `true`;
			sol.className = `correct`;
			sol.innerHTML = `✔<vr></vr>Correct`;

			if(Problem.difficulty > Highscores.difficulty){	Highscores.difficulty = Problem.difficulty; }
			if(Problem.complexity > Highscores.complexity){	Highscores.complexity = Problem.complexity;	}
			clearInterval(__ProblemTimeInterval);

			let totalatt = 0;
			let totaltime = 0;
			for (var i = 0; i < Problems.list.length; i++) {
				totalatt += Problems.list[i].tries;
				totaltime += Problems.list[i].time;
			}
			Highscores.averageAttempts = numberToDecimalNumber(totalatt / Problems.list.length,1);
			Highscores.averageTime = numberToDecimalNumber(totaltime / Problems.list.length,1);

			let pts = Problem.points;

			// TODO TODO TODO
			let add = Problem.problem.match(/(\+)/gmi);
			if(add){
				Points.addition += pts;
				Points.addition = numberToDecimalNumber(Points.addition,1);
			}

			let sub = Problem.problem.match(/(\-)/gmi);
			if(sub){
				Points.subtraction += pts;
				Points.subtraction = numberToDecimalNumber(Points.subtraction,1);
			}

			let mul = Problem.problem.match(/(\*)/gmi);
			if(mul){
				Points.multiplication += pts;
				Points.multiplication = numberToDecimalNumber(Points.multiplication,1);
			}

			let div = Problem.problem.match(/(\/)/gmi);
			if(div){
				Points.division += pts;
				Points.division = numberToDecimalNumber(Points.division,1);
			}

			let mod = Problem.problem.match(/(\%)/gmi);
			if(mod){
				Points.modulo += pts;
				Points.modulo = numberToDecimalNumber(Points.modulo,1);
			}

			generateGradeLevels();
			createStatsMenu();
		} else {
			sol.className = `incorrect`;
			if(ans.value != null && ans.value != ``){
				sol.innerHTML = `❌<vr></vr>${(Options.maxTries - Problem.tries)+0} tries left`;
			} else {
				sol.className = `hide`;
			}

			Problem.tries = Problem.tries+1;
			if(Problem.tries > Options.maxTries){
				$(this).off(event);
				ans.readOnly = `true`;
				generateGradeLevels();
				createStatsMenu();
			}
		}
	});
}
function createStatsMenu(){
	let stats = document.getElementById(`stats`);
	stats.innerHTML = ``;

	stats.appendChild(document.createElement(`hr`));

	let stats_title = document.createElement(`div`);
	stats_title.innerHTML = `<big>Stats:</big>`;
	stats_title.style.margin = `10px 0px 10px 0px`;
	stats_title.style.textAlign = `center`;
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
	let levels_div = document.createElement(`div`);
	levels_div.style.width = `50%`;
	levels_div.style.left = `50%`;
	levels_div.style.display = `inline-block`;
	levels_div.style.textAlign = `left`;
	stats.appendChild(levels_div);

	let levels_title = document.createElement(`div`);
	levels_title.style.margin = `10px 0px 10px 0px`;
	levels_title.style.textAlign = `center`;
	levels_title.innerHTML = `<big>Scoring:</big>`;
	//stats.appendChild(levels_title);
	levels_div.appendChild(levels_title);

	let add = document.createElement(`span`);
	add.className = `stat`;
	add.innerHTML = `Addition: ${Grades.addition}% <statbox class=${getLevelGrade(Grades.addition)}>${getLevelGrade(Grades.addition)}</statbox>`;
	levels_div.appendChild(add);

	//levels_div.appendChild(document.createElement(`br`));

	let sub = document.createElement(`span`);
	sub.className = `stat`;
	sub.innerHTML = `Subtraction: ${Grades.subtraction}% <statbox class=${getLevelGrade(Grades.subtraction)}>${getLevelGrade(Grades.subtraction)}</statbox>`;
	levels_div.appendChild(sub);

	//levels_div.appendChild(document.createElement(`br`));

	let mul = document.createElement(`span`);
	mul.className = `stat`;
	mul.innerHTML = `Multiplication: ${Grades.multiplication}% <statbox class=${getLevelGrade(Grades.multiplication)}>${getLevelGrade(Grades.multiplication)}</statbox>`;
	levels_div.appendChild(mul);

	//levels_div.appendChild(document.createElement(`br`));

	let div = document.createElement(`span`);
	div.className = `stat`;
	div.innerHTML = `Division: ${Grades.division}% <statbox class=${getLevelGrade(Grades.division)}>${getLevelGrade(Grades.division)}</statbox>`;
	levels_div.appendChild(div);

	//levels_div.appendChild(document.createElement(`br`));

	let mod = document.createElement(`span`);
	mod.className = `stat`;
	mod.innerHTML = `Modulo: ${Grades.modulo}% <statbox class=${getLevelGrade(Grades.modulo)}>${getLevelGrade(Grades.modulo)}</statbox>`;
	levels_div.appendChild(mod);

	stats.appendChild(document.createElement(`hr`));

	// Pregenerate hover text
	$(`statbox`).hover(function(k) {
		let me = $(this)[0];
		if(me != null){
		}
	});
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
	diffinfo.className = `stat statdiv`;
	//diffinfo.style = `padding: 4px; border: 2px solid #363636; border-radius: 4px; font-size: 10px; width: 60%; left: 50%; display: inline-block;`;
	if(inputdiff.value == 1){
		diffinfo.innerHTML = `Addition and subtraction problems using the values 0 to 8. Generates 2 to 3 numbers.`;
	} else if(inputdiff.value == 2){
		diffinfo.innerHTML = `Addition and subtraction problems using the values -6 to 12. Generates 3 numbers.`;
	} else if(inputdiff.value == 3){
		diffinfo.innerHTML = `Addition, subtraction, and multiplication problems using the values -10 to 20. Generates 3 to 4 numbers.`;
	} else if(inputdiff.value == 4){
		diffinfo.innerHTML = `Addition, subtraction, and multiplication problems using the values -12 to 24. Generates 4 numbers.`;
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
	opm.appendChild(diffinfo);

	opm.appendChild(document.createElement(`br`));

	let atttext = document.createElement(`div`);
	atttext.innerHTML = `Max Attempts: ${Options.maxTries}`;
	opm.appendChild(atttext);
	let inputatt = document.createElement(`input`); // <input type="text" name="answer"></input>
	inputatt.type = `range`;
	inputatt.min = `1`;
	inputatt.max = `10`;
	inputatt.name = `maxattempts`;
	inputatt.id = `maxattempts`;
	inputatt.defaultValue = Options.maxTries;
	inputatt.style.height = `5px`;
	inputatt.style.width = `25%`;
	inputatt.onmouseup = function(){
		let inputatt = document.getElementById(`maxattempts`);
		if(inputatt.value != Options.maxTries){
			Options.maxTries = Number(inputatt.value); }
			createOptionsMenu();
		};
	opm.appendChild(inputatt);
}

function toggleMenuSelector(){
	let msops = $(`#ms_ops`)[0];
	if(msops.className == `dropdown hide`){
		msops.className = `dropdown show`;
	} else {
		msops.className = `dropdown hide`;
	}
}
function toggleDropDown() {
	let dd = document.getElementById("myDropdown");
	let ms = document.getElementById("ms");
    dd.classList.toggle("show");
	if(ms.style.height != `calc(100% - 20px)`){
		ms.style.height = `calc(100% - 20px)`;
	} else {
		ms.style.height = ``;
	}
}
