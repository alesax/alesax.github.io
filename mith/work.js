var maxMultiply = 9;
var maxMultiplied = 12;
var exCount = 2;
var malusCount = 0;
var startTime = 0;
var errorCount = 0;

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

};
var ops = [];
ops.push (operations['-']);
ops.push (operations['+']);
ops.push (operations['*']);
ops.push (operations['/']);

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
	var result = gen(min, max);
	e.textContent = gex(result, min, max, 2, 0) + ' = ';
	e._val = result;

	//e.textContent = res[0] + ' = ';
	//e._val = res[1];
	var ne = document.createElement('input');
	ne.className = "res";
	ne.setAttribute('type', 'number');
	row.appendChild(e);
	row.appendChild(ne);
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
		if (c[i]._inp.value == c[i]._val) {
			c[i].className = "exa good";
			cntgood ++;
		} else {
			c[i].className = "exa wrong";
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
