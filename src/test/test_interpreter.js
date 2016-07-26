// from src folder command prompt  -  $ mocha

var assert = require("assert");
var parser = require('../parser');
var p = new parser.Parser();
var i = require('../interpreter');
var ast, patt;


describe('Interpreter', function() {
    describe('# recognize stitches', function () {
	it('should recognize ch', function () {
	    ast = p.parse("Row 1: ch, Ch, CH.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 3);
	});
	it('should recognize sc', function () {
	    ast = p.parse("Row 1: sc, Sc, SC.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 3);
	});
	it('should recognize hdc', function () {
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

    describe('# recognize numbers', function () {
	it('should recognize 1 as a Row number', function () {
	    ast = p.parse("Row 1: sc, hdc, sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches[patt.stitches.length-1].row.toString(), 1);
	});
	it('should recognize 1 digit Row numbers', function () {
	    ast = p.parse("Row 7: sc, hdc, sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches[patt.stitches.length-1].row.toString(), 7);
	});
	it('should recognize 2 digit Row numbers', function () {
	    ast = p.parse("Row 10: sc, hdc, sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches[patt.stitches.length-1].row.toString(), 10);
	});
	it('should recognize 3 digit Row numbers', function () {
	    ast = p.parse("Row 123: sc, hdc, sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches[patt.stitches.length-1].row.toString(), 123);
	});
	it('should correctly interpret a 1 after a stitch', function () {
	    ast = p.parse("Row 1: ch1, sc1, hdc1.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);	    
	    //console.log(patt.stitches);
	    assert.equal(patt.stitches.length, 3);
	});
	it('should correctly interpret a 1-digit number after a stitch', function () {
	    ast = p.parse("Row 1: ch3.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);	    
	    //console.log(patt.stitches);
	    assert.equal(patt.stitches.length, 3);
	});
	it('should correctly interpret a 2-digit number after stitch', function () {
	    ast = p.parse("Row 1: ch20.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);	    
	    //console.log(patt.stitches);
	    assert.equal(patt.stitches.length, 20);
	});
	it('should correctly interpret multiple numbers after stitches', function () {
	    ast = p.parse("Row 1: ch3, ch2, ch3.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);	    
	    //console.log(patt.stitches);
	    assert.equal(patt.stitches.length, 8);
	});
	it('should correctly interpret multiple numbers after stitches across multiple rows', function () {
	    ast = p.parse("Row 1: ch8. Row 2: Turn, ch1, sc3, hdc2, sc3.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);	    
	    //console.log(patt.stitches);
	    assert.equal(patt.stitches.length, 17);
	});
	it('should correctly interpret multiple numbers after stitches with skips', function () {
	    ast = p.parse("Row 1: ch13. Row 2: Turn, ch1, sc3, ch, sk, hdc2, sk, hdc2, sk, ch, sc3.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);	    
	    //console.log(patt.stitches);
	    assert.equal(patt.stitches.length, 26);
	});
    });
    
    describe('# recognize keywords', function () {
	it('should recognize turn', function () {
	    ast = p.parse("Row 1: sc, hdc, sc. \nRow 2: Turn, ch, sc, hdc, sc. \nRow 3: turn, ch, sc, hdc, sc. \nRow 4: TURN, ch, sc, hdc, sc.");
	    // console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 15);
	});
	it('should recognize skip', function () {
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
