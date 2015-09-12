// from src folder command prompt  -  $ mocha

var assert = require("assert");
var parser = require('../parser');
var p = new parser.Parser();
var i = require('../interpreter');
var ast, patt;


describe('Interpreter', function() {
    describe('# recognize stitches', function () {
	it('should recognize ch.', function () {
	    ast = p.parse("Row 1: ch, Ch, CH.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 3);
	});
	it('should recognize sc.', function () {
	    ast = p.parse("Row 1: sc, Sc, SC.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 3);
	});
	it('should recognize hdc.', function () {
	    ast = p.parse("Row 1: hdc, Hdc, HDC.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 3);
	});
    });

    describe('# process multiple stitches', function () {
	it('should work on one-row multi-st input', function () {
	    ast = p.parse("Row 1: sc, hdc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 3);
	});
	it('should work on multi-row multi-st input', function () {
	    ast = p.parse("Row 1: sc, hdc, sc. \nrow 2: ch, sc, hdc, sc. \nROW 3: ch, sc, hdc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 11);
	});
    });

    describe('# recognize keywords', function () {
	it('should recognize turn.', function () {
	    ast = p.parse("Row 1: sc, hdc, sc. \nRow 2: Turn, ch, sc, hdc, sc. \nRow 3: turn, ch, sc, hdc, sc. \nRow 4: TURN, ch, sc, hdc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 15);
	});
	it('should recognize skip.', function () {
	    ast = p.parse("Row 1: sc, sc, sc, sc, sc. \nRow 2: ch, sc, sk, ch, sc, skip, ch, sc. \nRow 3: ch, sc, sc, SKIP, ch, sc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 17);
	});
    });
    
    describe('# add links', function () {
	it('should add connections within one row', function () {
	    ast = p.parse("Row 1: sc, hdc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.connections.length, 2);
	});
	it('should add connections between rows', function () {
	    ast = p.parse("Row 1: sc, hdc, sc, hdc, sc. \nRow 2: ch, hdc, sc, hdc, sc, hdc. \nRow 3: ch, sc, hdc, sc, hdc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.connections.length, 26);
	});
	it('should add connections to but not from ch sts', function () {
	    ast = p.parse("Row 1: sc, sc, sc. \nRow 2: ch, sc, ch, sc, ch, sc. \nRow 3: ch, sc, sc, sc, sc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.connections.length, 22);
	});
    });
    
});
