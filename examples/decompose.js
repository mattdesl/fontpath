var funcs = {
	'm': 'moveTo',
	'l': 'lineTo',
	'q': 'quadraticCurveTo',
	'c': 'bezierCurveTo'
};

module.exports = function(path, context, max) {
	max = typeof max === "number" ? max : path.length;
	
	for (var i=0; i<path.length && i<max; i++) {
		var p = path[i];
		var args = p.slice(1);
		var fkey = funcs[ p[0] ];
		context[fkey].apply(context, args);
	}
};