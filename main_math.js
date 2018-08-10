// Problems
function generateMathProblem(difficulty){
	let p = { problem: ``, answer: 0 };
	let nums = 0;
	let min_num = 0;
	let max_num = 0;
	let dec = 0;
	let symbols = [];

	if(difficulty == 1){
		nums = getRandomInt(2,3);
		symbols = [`+`,`-`];
		min_num = 0;
		max_num = 8;

	} else if(difficulty == 2){
		nums = getRandomInt(2,5);
		symbols = [`+`,`-`];
		min_num = -6;
		max_num = 12;

	} else if(difficulty == 3){
		nums = getRandomInt(2,5);
		symbols = [`+`,`-`,`*`];
		min_num = -10;
		max_num = 20;

	} else if(difficulty == 4){
		nums = getRandomInt(3,5);
		symbols = [`+`,`-`,`*`];
		min_num = -12;
		max_num = 24;

	} else if(difficulty == 5){
		nums = getRandomInt(4,5);
		symbols = [`+`,`-`,`*`]; // × ÷
		min_num = -24;
		max_num = 42;

	} else if(difficulty == 6){
		nums = getRandomInt(4,6);
		symbols = [`+`,`-`,`*`,`/`];
		min_num = -42;
		max_num = 42;

	} else if(difficulty == 7){
		nums = getRandomInt(4,7);
		symbols = [`+`,`-`,`*`,`/`];
		min_num = -42;
		max_num = 86;

	} else if(difficulty == 8){
		nums = getRandomInt(5,7);
		symbols = [`+`,`-`,`*`,`/`,`%`];
		min_num = -86;
		max_num = 86;

	} else if(difficulty == 9){
		nums = getRandomInt(5,8);
		symbols = [`+`,`-`,`*`,`/`,`%`];
		min_num = -100;
		max_num = 100;
		dec = 1;

	} else {
		console.error(`main_math.js::generateMathProblem: No problem generated with difficulty: \'${difficulty}\'.`);
		return;
	}

	for (var i = 0; i < nums; i++) {
		let n = getRandomInt(min_num, max_num);
		if(difficulty > 3){
			n = numberToDecimalNumber(getRandomFloat(min_num, max_num), dec);
		}

		if(n < 0){
			n = `(${n})`;
		} else {
			n = `${n}`;
		}

		if(i < nums-1){
			p.problem += `${n} ${getRandomFromArray(symbols)} `;
		} else {
			p.problem += `${n}`;
		}
	}

	p.answer = solveMathProblem(p);
	p.difficulty = difficulty;
	p.complexity = getMathProblemComplexity(p);
	p.tries = 1;
	p.time = 0; //seconds

	if(
		(p.difficulty == 1 && p.complexity > 6) ||
		(p.difficulty == 2 && p.complexity > 9) ||
		(p.difficulty == 3 && p.complexity > 14) ||
		(p.difficulty == 4 && p.complexity > 19) ||
		(p.difficulty == 5 && p.complexity > 24) ||
		(p.difficulty == 6 && p.complexity > 29) ||
		(p.difficulty >= 7 && p.complexity > 34)
	){
		return tryGenerateMathProblem(difficulty);
	}

	//console.log(p);
	return p;
}

function solveMathProblem(problem){
	try { eval( problem.problem ); } catch(err) { throw err; };
	return numberToDecimalNumber(eval( problem.problem ), 1);
}
function tryGenerateMathProblem(difficulty){
	try {
		return generateMathProblem(difficulty);
	}
	catch (err) {
		throw err;
	}
}
function getStatBoxColor(value){
	let color = `#363636`;

	if(value < 1){
		color = `#363636`;
	} else if(value < 5){
		color = `#363640`;
	} else if(value < 10){
		color = `#363656`;
	} else if(value < 20){
		color = `#404060`;
	} else if(value < 30){
		color = `#404076`;
	} else if(value < 40){
		color = `#404080`;
	} else if(value < 50){
		color = `#404096`;
	} else if(value < 60){
		color = `#5656a0`;
	} else if(value < 70){
		color = `#5656b6`;
	} else if(value < 80){
		color = `#5656c0`;
	} else if(value < 90){
		color = `#5656d6`;
	} else if(value > 90){
		color = `#6060f0`;
	}

	return color;
}
function simplifyMathProblem(problem){
	let p = problem;
	p.problem = p.problem
	//.replace(/(\s{0,}[-+*/%]{0,}\s{0,}0\s{0,}[-+*/%]{0,}\s{0,})/gm,``)
	// .replace(/(- \(-(.{0,})\))/gm,`+ $2`)
	// .replace(/(\+ \(-(.{0,})\))/gm,`- $2`);
	.replace(/(-{0,}[^\s\-\+\*\/\%]+) - \(-([^\s\-\+\*\/\%]+)\)/gm, `$1 + $2`)
	.replace(/(-{0,}[^\s\-\+\*\/\%]+) ([\-\+\*\/\%]) 0/gm,`$1`)
	.replace(/0 ([\-\+\*\/\%]) (-{0,}[^\s\-\+\*\/\%]+)/gm,`$2`)
	;

	p.answer = solveMathProblem(p);
	p.difficulty = problem.difficulty;
	p.complexity = getMathProblemComplexity(p);
	return p;
}
function getMathProblemComplexity(problem){
	let c = 0;

	c += problem.difficulty/5;
	c += problem.problem.length/10;

	nums = problem.problem.match(/(-{0,}\d{1,}\.{0,}\d{0,})/gm);
	for (var i = 0; i < nums.length; i++) {
		let n = Math.abs(Number(nums[i]));
		c += n/10;
	}
	symbs = problem.problem.match(/([\-\+\*\/\%])/gm);
	for (var i = 0; i < symbs.length; i++) {
		if(symbs[i] == `+`){ c += 0.05; }
		else if(symbs[i] == `-`){ c += 0.075; }
		else if(symbs[i] == `*`){ c += 0.1; }
		else if(symbs[i] == `/`){ c += 0.2; }
		else if(symbs[i] == `%`){ c += 0.3; }
	}
	c += 0.5 * symbs.length;

	return numberToDecimalNumber(c,1);
}

// Math Helpers
function isNearSolution(val){
	// If the difference between the solution and the specified value is less than 0.05, return true
	if(Problem.difficulty < 3){
		return val == Problem.answer;
	}
	return ( Math.max(val, Problem.answer) - Math.min(val, Problem.answer) < 0.01);
}
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
	return Math.round(Math.random() * (max - min) + min);
}
function getSmallNumberString(num, k_d, m_d, b_d, t_d){
	k_d = k_d || 2;
	m_d = m_d || 2;
	b_d = b_d || 2;
	t_d = t_d || 2;
	let isNegative = false;

	let small = `${num}`;
	if(num < 0){
		num = -num;
		isNegative = true;
	}

	if(num == Infinity){
		return `???`;
	}

	if(num > 999999999999){
		small = `${(num/1000000000000).toFixed(t_d)}t`;
	} else if(num > 999999999){
		small = `${(num/1000000000).toFixed(b_d)}b`;
	} else if(num > 999999){
		small = `${(num/1000000).toFixed(m_d)}m`;
	} else if(num > 999){
		small = `${(num/1000).toFixed(k_d)}k`;
	} else {
		small = num.toFixed(2);
	}
	small = numberToCommaNumber(small);
	if(isNegative){
		return `-${small}`;
	}
	return small;
}
function numberToFixed(num){
	// Converts the number to a small number (e.g. 2.42k) then converts it to a fixed decimal number (string)
	if(Number(num) !== num){
		num = Number(num);
		console.warn(`main.js::numberToFixed: Tried to convert a string to a fixed number.`);
	}
	return getSmallNumberString(num);
}
function numberToCommaNumber(num){
	while(num.match(/(\d{1,})(\d{3,})/gmi) && !num.includes(`e`) && num != Infinity){
		num = num.replace(/(\d{1,})(\d{3,})/gmi,`$1,$2`);
	}
	return num;
}
function fixedToNumber(num){
	return Number(num);
}
function fixedToDecimalNumber(num){
	// Converts a number or fixed number (not recommended) to a 2-decimal number
	//return fixedToNumber(numberToFixed(num));
	if(num == Infinity || isNaN(num)){
		return Infinity;
	}
	return fixedToNumber(numberToDecimalNumber(num)); //num.toFixed(2)
}
function numberToDecimalNumber(num, dec){
	return Number(num.toFixed(dec).replace(/(\d+).(\d{0,2})\d{0,}/gm,`$1.$2`));
}

// Arays and Probability
function generateWeighedList(list, weight) {
	var weighed_list = [];

	// Loop over weights
	for (var i = 0; i < weight.length; i++) {
		var multiples = weight[i] * 100;

		// Loop over the list of items
		for (var j = 0; j < multiples; j++) {
			weighed_list.push(list[i]);
		}
	}

	return weighed_list;
}
function getRandomFromArray(arr){
	if(arr == null){ return null; }
	return arr[Math.floor(Math.random(0, 1) * arr.length)];
}
function getRandomFromProbability(arr){
	if(arr == null){ return null; }

	let weights = arr.map((v, i) => Array(v).fill(arr[i].p));
	let new_arr = generateWeighedList( arr, weights );

	return getRandomFromArray(new_arr);
}
