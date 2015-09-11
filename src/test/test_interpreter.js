// from src folder command prompt  -  $ mocha

var assert = require("assert");
var parser = require('../parser');
var p = new parser.Parser();
var i = require('../interpreter');
var patt;


describe('Interpreter', function() {
    describe('# recognize stitches', function () {
	it('should work on one-row one-st input sc.', function () {
	    patt = i.interpret(p.parse("Row 1: sc."));
	    assert.equal(patt.stitches.length, 1);
	});
	it('should work on one-row one-st input hdc.', function () {
	    patt = i.interpret(p.parse("Row 1: hdc."));
	    assert.equal(patt.stitches.length, 1);
	});
	it('should work on one-row multi-st input', function () {
	    patt = i.interpret(p.parse("Row 1: sc, hdc, sc."));
	    assert.equal(patt.stitches.length, 3);
	});
	it('should work on multi-row multi-st input', function () {
	    patt = i.interpret(p.parse("Row 1: sc, hdc, sc. \nRow 2: ch, sc, hdc, sc. \nRow 3: ch, sc, hdc, sc."));
	    assert.equal(patt.stitches.length, 11);
	});
    });

    describe('# add links', function () {
	it('should add connections within one rowt', function () {
	    patt = i.interpret(p.parse("Row 1: sc, hdc, sc."));
	    assert.equal(patt.connections.length, 2);
	});
	it('should add all connections between rows', function () {
	    patt = i.interpret(p.parse("Row 1: sc, hdc, sc, hdc, sc. \nRow 2: ch, hdc, sc, hdc, sc, hdc. \nRow 3: ch, sc, hdc, sc, hdc, sc."));
	    assert.equal(patt.connections.length, 26);
	});
	it('should add connections to but not from ch sts', function () {
	    patt = i.interpret(p.parse("Row 1: sc, sc, sc. \nRow 2: ch, sc, ch, sc, ch, sc. \nRow 3: ch, sc, sc, sc, sc, sc."));
	    assert.equal(patt.connections.length, 22);
	});
    });
    
});
