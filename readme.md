# vector font tools

Generates paths and kerning data from a TTF/OTF/WOFF/etc font. The paths can then be decomposed into points, or rendered to a canvas, or triangulated.

The project is similar to [typeface.js](http://typeface.neocracy.org/) and [cufon](http://cufon.shoqolate.com/generate/). Both of those tools are very old, and were made before @font-face gained widespread support. This project has a few different goals in mind:

- Stronger focus on WebGL/animations/effects rather than trying to replace DOM text rendering
- NPM/node tooling, eventual integration with build tools
- decoupled modules, e.g. outline generator doesn't depend on rendering utils
- rendering engine isn't tied to Canvas (or even the browser; e.g. you could use node-canvas)
- eventually, these tools could be used by a server to generate paths or hinted bitmap data for the client
- TTF, OTF, WOFF, and most other formats supported (FreeType2)
- font converter is an offline tool and fairly easy to modify (i.e. for a custom JSON/binary exporter)
- you can specify any charsets with the API (e.g. foreign and icon fonts)
- other stuff: hit detection on paths, advanced glyph/face metrics

# example

```fontpath myfont.ttf -o mfont.json --size 128```

The default size is 12 pt, but exporting with a higher font size will give you better resolution when rendering the path at large sizes.