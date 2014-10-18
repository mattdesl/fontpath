//Exports to a minimal JSON format that is useful for web purposes
var fs = require('fs');
var pkg = require('../package.json');

var EXPORTER_NAME = "SimpleJson";

function SimpleJson() {
}

SimpleJson.prototype.export = function(fontInfo, options) {
	var writer = options.output ? fs.createWriteStream(options.output) : process.stdout;

	var objOut = {};
	for (var k in fontInfo) {
		if (k !== 'glyphs' && k !== 'kerning')
			objOut[k] = fontInfo[k];
	}	

	//For better minification, a list of arrays
	//Format: [leftChar, rightChar, kerning]
	objOut.kerning = [];

	if (fontInfo.kerning) {
		for (var i=0; i<fontInfo.kerning.length; i++) {
			var kern = fontInfo.kerning[i];
			objOut.kerning.push( 
				[ String.fromCharCode(kern.left),
				  String.fromCharCode(kern.right),
				  kern.value ]);
		}
	}
		
	objOut.glyphs = {};
	for (var i=0; i<fontInfo.glyphs.length; i++) {
		var g = fontInfo.glyphs[i];
		var glyphOut = {
			xoff: g.metrics.horiAdvance,
			width: g.metrics.width,
			height: g.metrics.height,
			hbx: g.metrics.horiBearingX,
			hby: g.metrics.horiBearingY
		};
		if (g.outline)
			glyphOut.path = g.outline || [];
		objOut.glyphs[ String.fromCharCode(g.code) ] = glyphOut;
	}

	objOut.exporter = EXPORTER_NAME;
	objOut.version = pkg.version;

	var jsonOut = JSON.stringify(objOut, null, options.prettyPrint ? 2 : null);

	if (options.commonJS) {
		jsonOut = "module.exports = "+jsonOut+";";
	}

	writer.write(jsonOut);
}

SimpleJson.prototype.getGlyphOutline = function(ft, face, code) {
	if (face.glyph.format !== ft.GLYPH_FORMAT_OUTLINE) {
		// console.warn("Charcode", code, "("+String.fromCharCode(code)+") has no outline");
		return [];
	}
	var data = [];
	ft.Outline_Decompose(face, {
		move_to: function(x, y) {
			data.push(["m", x, y]);
		},
		line_to: function(x, y) {
			data.push(["l", x, y]);
		},
		quad_to: function(cx, cy, x, y) {
			data.push(["q", cx, cy, x, y]);
		},
		cubic_to: function(cx1, cy1, cx2, cy2, x, y) {
			data.push(["c", cx1, cy1, cx2, cy2, x, y]);
		},
	});
	return data;
}

//small decrease in filesize, worse to parse though.. worth it?
SimpleJson.prototype.getGlyphOutlineStr = function(ft, face, code) {
	if (face.glyph.format !== ft.GLYPH_FORMAT_OUTLINE) {
		// console.warn("Charcode", code, "("+String.fromCharCode(code)+") has no outline");
		return [];
	}
	var data = "";
	ft.Outline_Decompose(face, {
		move_to: function(x, y) {
			data += "m "+(Math.floor(x))+" "+(Math.floor(y))+" ";
		},
		line_to: function(x, y) {
			data += "l "+(Math.floor(x))+" "+(Math.floor(y))+" ";
		},
		quad_to: function(cx, cy, x, y) {
			data += "q "+(Math.floor(cx))+" "+(Math.floor(cy))+" "+(Math.floor(x))+" "+(Math.floor(y))+" ";
		},
		cubic_to: function(cx1, cy1, cx2, cy2, x, y) {
			data += "c "+(Math.floor(cx1))+" "+(Math.floor(cy1))+" "+(Math.floor(cx2))+" "+(Math.floor(cy2))+" "+(Math.floor(x))+" "+(Math.floor(y))+" ";
		},
	});
	return data.trim();
}

module.exports = SimpleJson;