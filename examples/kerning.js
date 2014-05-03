module.exports = function(font, left, right) {
	if (!font.kerning) 
		return 0;
	for (var i=0; i<font.kerning.length; i++) {

		var kLeft = font.kerning[i][0];
		var kRight = font.kerning[i][1];
		var value = font.kerning[i][2];

		if (left == kLeft && right == kRight) {
			return value;
		}
	}
	return 0;
}