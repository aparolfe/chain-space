## Chain-space

The aim of the project is to create a website that allows users to convert written instructions for a crochet pattern into a charted format and save the resulting charts as SVG files. The functionality is implemented completely client-side and once loaded the website will continue to work offline.

### Try it out

[Chain-space on the web](http://chain-space.org/)

## Codebase

Chain-space uses [Node.js](https://nodejs.org/download/) and the following modules:
* [browserify](http://browserify.org/) - bundles up the source JavaScript files and modules into a single app.js file
* [d3](https://d3js.org/) - visualization library that displays the crochet chart
* [filesaver.js](https://github.com/eligrey/FileSaver.js/) - allows the user to download their charts as SVG files
* [jQuery](https://jquery.com/) - makes JavaScript simpler to read and write
* [mocha](https://mochajs.org/) - makes testing the code easy
* [seedrandom](https://github.com/davidbau/seedrandom) - used to make the graphical output deterministic
* [waxeye.js](https://github.com/orlandohill/waxeye) - generates the parser for the crochet-instructions grammar

### Code structure overview

##### Converting the written instructions into a standardized format
The **crochet.waxeye** file contains a grammar for the crochet instructions, which specifies the format of allowable user input and the vocabulary of recognized keywords and stitch names. Waxeye converts this grammar into the **parser.js** file, and this parser file can convert the user input into a Abstract Syntax Tree (AST).

##### Creating the graphical abstraction of the crochet pattern
The **interpreter.js** file iterates over the AST generated by the parser and populates arrays of nodes and links; every node corresponds to a single stitch and every link represents a connection between two stitches (either because they are adjacent or because one of them is worked into the other).

##### Displaying the graphical abstraction as a crochet chart
The **main.js** file uses the d3 library to display the nodes and links obtained from the interpreter as a graph. The graph uses a simple force-directed layout, with the nodes repelling each other and the links between nodes keeping them together. Each node is an image of the appropriate crochet stitch symbol, thus making it understandable as a crochet chart. The main.js file also contains all the front-end event handling so the buttons work.

##### Supporting files
The **stitches.js** file contains the svg vector image descriptions for all the supported stitches, and needs to be updated every time the grammar is expanded with new stitch names.
The **swatches.js** file contains the several samples of written instructions, which are presented on the website as examples. This file is usually updated when new stitches or keywords are added to the grammar file.
The **style.scss** file contains the SASS which gets converted into the app.css file for the website CSS.

### Installing dependencies

Most of the dependencies can be installed using [npm](https://www.npmjs.com/) as follows:
```
npm install -g browserify
npm install d3
npm install file-saver
npm install jquery
npm install mocha
npm install seedrandom
```
Install [waxeye](https://github.com/orlandohill/waxeye) following these [instructions](https://waxeye.org/manual.html).

### Building

After any changes to the grammar (crochet.waxeye) file, from the chain-space/src folder command prompt run
```
waxeye -g javascript . crochet.waxeye
```
This will generate the parser file (parser.js) in the same folder.

After any changes to the style.scss file, from the chain-space folder command prompt run
```
sass src/style.scss app.css
```
This updates the app.css file with the latest changes.

After changes to any files in the chain-space/src folder, from the chain-space folder command prompt run
```
browserify src/main.js -o app.js
```
This will update the app.js file with the latest changes.

View the index.html file from the chain-space folder to see the updated website.

### Testing

To run all the tests in the chain-space/src/test folder, from the chain-space/src command prompt run
```
mocha
```
Fairly comprehensive unit-tests have been written for the interpreter, and should be added to every time the grammar is expanded.
