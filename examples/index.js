var domready = require('domready');

var font = require('./Lato.json');
var decompose = require('./decompose');
var kerning = require('./kerning');

var util = require('fontutils');

function start() {
	var div = document.createElement("div");
	div.className = "sel";
	div.style.position = "absolute";
	div.style.top = "237px";
	// div.style.color = "rgba(255,255,0,0.0)";
	// div.style.opacity = "0";

	div.style.left = "255px";
	div.style.display = "inline-block";
	div.style.whiteSpace = "nowrap";
	div.style.verticalAlign = "text-top";
	div.style.zIndex = 1000;
	var strt = "fanciful text";
	div.innerHTML = strt;
	// document.body.appendChild(div);

	var canvas = document.createElement("canvas");
	document.body.style.margin = "0";
	document.body.appendChild(canvas);

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	var width = canvas.width,
		height = canvas.height;

	var context = canvas.getContext("2d");

	var size = 64; //the POINT size...
	var pxSize = util.pointsToPixels(size, font.resolution); //the PIXEL size

	div.style.font = context.font = "normal "+pxSize+"px 'Lato'";

	function renderText(str, animate) {
		//PROBLEM appears to be that font->height is not scaled..

		var pointScale = (32/font.size) * pxSize / font.units_per_EM;
		// console.log(pointScale)

		context.save();
		context.translate(255, 300);
		context.scale(pointScale, -pointScale);

		//This is a "slow" way of rendering fonts with canvas for two reasons:
		//1. We are introducing a new path for each font. If the string is all
		//a single color, we can render the whole thing as a single path.
		//
		//2. We are using a ot of context save/translate/scale/restore, which
		//would be better to manage manually.
		for (var i=0; i<str.length; i++) {
			var chr = str.charAt(i);
			var glyph = font.glyphs[chr];
			context.save();
			// context.translate(0, -glyph.ascender);
			
			context.globalAlpha = 0.5;
			context.fillStyle = 'lightGray';	
			// context.fillRect(0, 0, glyph.xoff, -font.height);

			context.fillStyle = 'gray';
			context.fillRect(0, 0, glyph.xoff, glyph.height);

			context.globalAlpha = 0.8;
			context.beginPath();
			decompose(glyph.path, context, ~~(glyph.path.length * animate));

			context.fillStyle = 'black';
			context.lineWidth = 25;
			context.fill();
			context.restore();

			var kern = 0;
			if (i < str.length-1) {
				kern = kerning(font, chr, str.charAt(i+1));
			}
			if (kern)
				console.log(kern, chr, str.charAt(i+1));

			context.translate(glyph.xoff+kern, 0);
		}
		context.restore();
	}

	var time = 0;

	function render() {
		time += 0.1;
		requestAnimationFrame(render);

		context.clearRect(0, 0, width, height);

		//close but not perfect
		context.globalAlpha = .2;
		context.fillStyle = 'red';
		context.fillText(strt, 255, 300)

		var anim = Math.sin(time*0.5)/2+0.5;
		renderText(strt, anim);
	}

	requestAnimationFrame(render);

}


domready(function() {
	// start()
	setTimeout(start, 0);
});