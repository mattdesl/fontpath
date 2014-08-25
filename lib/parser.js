function Parser(buffer, options) {

}

Parser.Font = function() {

};




module.exports = parser




/*
Parser: parses TTF/OTF/WOFF/etc files into objects:

Data
    type
    version
    scaled
    family_name
    style_name
    size
    style_flags
    face_flags
    
    ascender
    descender
    underline_thickness
    underline_position
    
    max_advance_width
    width
    height

    glyphs
    kerning
    paths

    bitmap //only if we have fontpath-bmfont
 */