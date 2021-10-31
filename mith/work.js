var maxMultiply = 12;
var maxMultiplied = 200;
var exCount = 20;
var malusCount = 0;
var startTime = 0;
var errorCount = 0;
var maxDivWithMod = 14;

var operations = {
	'-': {  'gex' : function(result, min, max, parpro, level) {
			var y = gen(result, max);
			return (gex(y, min, max, parpro - 1, level + 1) + " - " + gex(y - result, min, max, parpro - 1, level + 1) );
		},
		'gen' : function(i,a){ 
			var x = gen(i,a); var y = gen(i,x);
			return ([x + ' - ' + y, x - y]);
		}
	},
	'+': { 
		'gex' : function(result, min, max, parpro, level) {
			var y = gen(min, result);
			return (gex(y, min, max, parpro - 1, level + 1) + " + " + gex(result - y, min, max, parpro - 1, level + 1) );
		},
		'gen' : function(i,a){ 
			var x = gen(i,a); var y = gen(x,a);
			return ([x + ' + ' + y, x + y]);
		}
	},
	'*': {
		'gex' : function(result, min, max, parpro, level) {
			for (var i = maxMultiply; i > 1; i --) {
				if ((result % i) == 0 && (result/i)>= min && (result/i) <= maxMultiplied) {
					return (gex(result / i, min, max, parpro - 1, level + 1) + " . " + gex(i, min, max, parpro - 1, level + 1) );
				}
			}
			throw "Cannot multiply";
		}
	},
	'/': {
		'gex' : function(result, min, max, parpro, level) {
			for (var i = maxMultiply; i > 1; i --) {
				if (result * i <= max && result * i <= maxMultiplied) {
					return (gex(result * i, min, max, parpro - 1, level + 1) + " / " + gex(i, min, max, parpro - 1, level + 1) );
				}
			}
			throw "Cannot divide";
		}
	},
	'/mod': {
		'gex' : function(result, min, max, parpro, level) {
			if (level != 0) throw "Div with remainder can only be applied to 1st level";

			// result = a / b + rem
			var maxdiv = Math.min(maxDivWithMod+1, Math.floor(result/2));
			maxdiv = Math.min (maxdiv, Math.floor(maxMultiplied / result));
			if (maxdiv < 3) throw "Cannot div - too small";
			var arr = [...Array(maxdiv).keys()].slice(2);

			shuffleArray(arr);
			var i = arr [0];
			var rem = gen(0, i);

			var a = gex(result * i - (i - rem), min, max, parpro - 1, level + 1);
			var b = gex(i, min, max, parpro - 1, level + 1);
			result -= (rem>0)?1:0;

			return ({ exa: a + " / " + b + ":::" + result + "~~" + arr /*+ "{ "+ result + "," + rem  + "," + result*i + " }"*/, result: result, reminder: rem});

			throw "Cannot divide";
		}
	},


};
var ops = [];
ops.push (operations['-']);
//ops.push (operations['+']);
//ops.push (operations['*']);
//ops.push (operations['/']);
if (maxDivWithMod)
	ops.push (operations['/mod']);

function gen(i,a) 
{
	return Math.floor((Math.random()*((a)-i))+i);
}

function genEx(i, a, z)
{
	var op = ops[gen(0,ops.length)];
	var res = op['gen'](i,a);
	return res;
}

function gex(result, min, max, parpro, level)
{
	if (level == 2) return result + "";
	else if (level == 1 && gen(0, 100) < 62) return result + "";
	//if (gen(0, parpro) > (parpro/2)) {
	//	return "(" + gex(result, min, max, parpro - 1, level) + ")";
	//}
	var opid = gen(0,ops.length);
	do {
		try {
			var op = ops[opid%ops.length];
			var res = op['gex'](result, min, max, parpro, level);
			if (level > 0) return "( " + res + " )";
			else return res;
		} catch(e) {
			opid++;
			continue;
		}
	} while(true);
}

function pad(s)
{
	s = s + "";
	if (s.length > 1) return s;
	else return ("0" + s);
}
function checkTime()
{
	var time = document.getElementById('time');
	var tm = new Date(new Date() - startTime);
	time.textContent = pad(tm.getHours()-1) + ":" + pad(tm.getMinutes()) + ":" + pad(tm.getSeconds());
}

function createExample()
{
	var min = document.forms['mForm'].min.value;
	var max = document.forms['mForm'].max.value;
	var examples = document.getElementById('examples');

	var row = document.createElement('div');
	row.className = "roe";
	var e = document.createElement('div');
	e.className = "exa";
	row.appendChild(e);

	var ne = document.createElement('input');
	ne.className = "res";
	ne.setAttribute('type', 'number');
	row.appendChild(ne);
	var result = gen(min, max);
	var res = gex(result, min, max, 2, 0);

	if (typeof(res) == 'object') {
		e._val = res;

		var re = document.createElement('input');
		ne.className = "res15";
		re.className = "res10";
		re.setAttribute('type', 'number');
		row.appendChild(re);
		e.textContent = res.exa + ' = ';
		e._inp_rem = re;

	} else {
		e.textContent = res + ' = ';
		e._val = result;
	}


	//e.textContent = res[0] + ' = ';
	//e._val = res[1];
	examples.appendChild(row);
	e._inp = ne;

}

function start(e)
{
	malusCount = 0;
	var examples = document.getElementById('examples');
	var i;

	while(examples.childNodes.length)
		examples.removeChild(examples.firstChild);

	for (i = 0; i < exCount; i++) {
		createExample();
	}
	setInterval(checkTime, 100);
	startTime = new Date();

	//document.forms['mForm'].op.value);
}

function check(e)
{
	var c = document.getElementsByClassName('exa');
	var i;
	var cntgood = 0;
	var cntbad = 0;

	for (i = 0; i < c.length; i++) {
		var z = c[i];
		if (typeof(z._val) == 'object' 
			&& z._inp.value == z._val.result 
			&& z._inp_rem.value == z._val.reminder) {
			z.className = "exa good";
			cntgood ++;
		} else if (z._inp.value == z._val) {
			z.className = "exa good";
			cntgood ++;
		} else {
			z.className = "exa wrong";
			cntbad ++;
		}
	}
	for (i = 0; i < cntbad; i ++)
		createExample();

	if (cntbad == 0) {
		clearInterval(checkTime);
	}
}

function findTrueRow(r)
{
	while (r != null && r._result == undefined) r = r.parentNode;
	return r;
}

function allowDrop (e)
{
	e.preventDefault();
}
function dragEnter (e)
{
	console.log(e.target);
	console.log("DragEnter " + document._dragi);
	var rou = findTrueRow(e.target);
	if (rou == null) return;
	if (rou == document._dragi) return;
	var src = e.dataTransfer.getData("id");
	rou.parentNode.insertBefore(document._dragi, rou);

}

function dragOver(e)
{
	e.preventDefault();
	console.log(e.target);
	console.log(document._dragi);
	var rou = findTrueRow(e.target);
	if (rou == null) return;
	var src = e.dataTransfer.getData("id");
	rou.parentNode.insertBefore(document._dragi, rou);

}

function drop(e)
{
	e.preventDefault();
}

function dragStart(e)
{
	var row = findTrueRow(e.target);
	if (row == null) return;
	e.dataTransfer.setData("id", row.id);
	document._dragi = row;
	console.log("DragStart");
}

function createExampleSG(result)
{
	var min = document.forms['mForm'].min.value;
	var max = document.forms['mForm'].max.value;
	var examples = document.getElementById('examples');

	var row = document.createElement('div');
	row.className = "roe";
	var e = document.createElement('div');
	e.className = "exa_sg";
	e.textContent = gex(result, min, max, 2, 0);
	e._val = result;

	//e.textContent = res[0] + ' = ';
	//e._val = res[1];
	row.appendChild(e);
	examples.appendChild(row);

	row.setAttribute('draggable', 'true');
	row.addEventListener('dragstart', dragStart);
	row.addEventListener('dragover', allowDrop);
	row.addEventListener('dragenter', dragEnter);
	//row.addEventListener('dragend', dragEnd);
	//row.addEventListener('dragexit', dragEnd);
	row.addEventListener('drop', drop);
	row._result = result;

}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startSortGame(e)
{
	var min = parseInt(document.forms['mForm'].min.value);
	var max = parseInt(document.forms['mForm'].max.value);

	malusCount = 0;
	var examples = document.getElementById('examples');
	var i;

	while(examples.childNodes.length)
		examples.removeChild(examples.firstChild);

	var arr = (Array.from(Array(max)).map((e,i)=>i+min));
	shuffleArray(arr);
	arr = arr.slice(0, exCount);

	for (i = 0; i < exCount; i++) {
		console.log(arr[i]);
		createExampleSG(arr[i]);
	}

	arr = arr.sort();
	document._sgresults = arr;

	setInterval(checkTime, 100);
	startTime = new Date();

	//document.forms['mForm'].op.value);
}

function checkSortGame(e)
{
	var c = document.getElementsByClassName('exa');
	var i;
	var cntgood = 0;
	var cntbad = 0;

	for (i = 0; i < c.length; i++) {
		if (c[i]._val != sgresults[i]) {
			cntbad ++;
			alert("chyba!");
			break;
		}
	}

	if (cntbad == 0) {
		clearInterval(checkTime);
	}
}

function init()
{

}
