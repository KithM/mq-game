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
		max_num = 4;

	} else if(difficulty == 2){
		nums = getRandomInt(2,5);
		symbols = [`+`,`-`];
		min_num = -2;
		max_num = 6;

	} else if(difficulty == 3){
		nums = getRandomInt(3,6);
		symbols = [`+`,`-`,`*`];
		min_num = -12;
		max_num = 24;

	} else if(difficulty == 4){
		nums = getRandomInt(4,8);
		symbols = [`+`,`-`,`*`,`/`]; // × ÷
		min_num = -24;
		max_num = 42;
		dec = 1;

	} else if(difficulty > 4){
		nums = getRandomInt(5,8);
		symbols = [`+`,`-`,`*`,`/`,`%`];
		min_num = -(difficulty*10);
		max_num = (difficulty*10);
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

	if(p.difficulty == 1 && p.complexity > 5){
		return tryGenerateMathProblem(difficulty);
	} else if(p.difficulty == 2 && p.complexity > 9){
		return tryGenerateMathProblem(difficulty);
	} else if(p.difficulty == 3 && p.complexity > 14){
		return tryGenerateMathProblem(difficulty);
	} else if(p.difficulty == 4 && p.complexity > 19){
		return tryGenerateMathProblem(difficulty);
	}
	if(p.complexity > 24){
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
function simplifyMathProblem(problem){
	let p = problem;
	p.problem = p.problem
	//.replace(/(\s{0,}[-+*/%]{0,}\s{0,}0\s{0,}[-+*/%]{0,}\s{0,})/gm,``)
	.replace(/(- \(-(.{0,})\))/gm,`+ $2`)
	.replace(/(\+ \(-(.{0,})\))/gm,`- $2`);

	p.answer = solveMathProblem(p);
	p.difficulty = problem.difficulty;
	p.complexity = getMathProblemComplexity(p);
	return p;
}
function getMathProblemComplexity(problem){
	let c = 0;

	c += problem.difficulty/5;
	c += problem.problem.length/10;

	for (var n in problem.problem) {
		let num = Math.abs(Number(n));
		c += (num / 100) * 1.25;
	}

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
