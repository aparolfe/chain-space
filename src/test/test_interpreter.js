// from src folder command prompt  -  $ mocha

var assert = require("assert");
var parser = require('../parser');
var p = new parser.Parser();
var i = require('../interpreter');
var ast, patt, result;


describe('Interpreter', function() {
    describe('# recognize primitive stitches', function () {
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
	it('should recognize hdc', function () {
	    ast = p.parse("Row 1: dc, Dc, DC.");
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
	it('should correctly interpret a 1-digit number after a stitch and space', function () {
	    ast = p.parse("Row 1: ch 3.");
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
	it('should correctly interpret a 2-digit number after stitch and space', function () {
	    ast = p.parse("Row 1: ch 17.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);	    
	    //console.log(patt.stitches);
	    assert.equal(patt.stitches.length, 17);
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
	    ast = p.parse("Row 1: sc5. \nRow 2: ch, sc, skip, ch, sc, sk, ch, sc. \nRow 3: ch, sc, SKIP, ch, sc, ch, SK, sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 17);
	    result = { row: 2, st: 2, type: 'sc' };
	    assert.deepEqual(patt.connections[patt.connections.length-1].target, result);
	});
	it('should recognize skip followed by a single-digit number', function () {
	    ast = p.parse("Row 1: ch7. \nRow 2: ch, sc, sk2, ch2, sc, skip2, ch2, sc. \nRow 3: ch, sc2, SK1, SKIP2, ch, sc2.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 21);
	    result = { row: 2, st: 2, type: 'sc' };
	    assert.deepEqual(patt.connections[patt.connections.length-1].target, result);
	}); 
	it('should recognize skip followed by a space and a single-digit number', function () {
	    ast = p.parse("Row 1: ch7. \nRow 2: ch, sc, sk 2, ch2, sc, skip 2, ch2, sc. \nRow 3: ch, sc2, SK 1, SKIP 2, ch, sc2.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 21);
	    result = { row: 2, st: 2, type: 'sc' };
	    assert.deepEqual(patt.connections[patt.connections.length-1].target, result);
	});
	it('should recognize skip followed by a double-digit number', function () {
	    ast = p.parse("Row 1: ch15. \nRow 2: ch, sc, sk13, ch15, sc. \nRow 3: ch, sc, SKIP15, ch15, sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 51);
	    result = { row: 2, st: 2, type: 'sc' };
	    assert.deepEqual(patt.connections[patt.connections.length-1].target, result);
	});
	it('should recognize skip followed by a space and a double-digit number', function () {
	    ast = p.parse("Row 1: ch15. \nRow 2: ch, sc, sk 13, ch15, sc. \nRow 3: ch, sc, SKIP 15, ch15, sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 51);
	    result = { row: 2, st: 2, type: 'sc' };
	    assert.deepEqual(patt.connections[patt.connections.length-1].target, result);
	}); 
	it('should recognize repeat for a row', function () {
	    ast = p.parse("Row 1: ch5. \nRow 2: ch, sc5. \nRow 3: Rep Row 2. \nRow 4: REP Row 2. \nRow 5: Repeat Row 2. \nRow 6: REPEAT Row 2.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 35);
	    result = { row: 5, st: 2, type: 'sc' };
	    assert.deepEqual(patt.connections[patt.connections.length-1].target, result);
	});
	it('should handle repeating multiple rows recursively', function () {
	    ast = p.parse("Row 1: ch9. \nRow 2: ch2, dc, (dc, ch, dc), sk2,  (dc, ch, dc), sk2,  (dc, ch, dc), dc. \nRow 3: ch2, dc, sk, (dc, ch, dc), sk2,  (dc, ch, dc), sk2,  (dc, ch, dc), sk, dc. \nRow 4: Rep Row 3. \nRow 5: REP Row 4. \nRow 6: Repeat Row 5. \nRow 7: REPEAT Row 4.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 87);
	    result = { row: 6, st: 3, type: 'dc' };
	    assert.deepEqual(patt.connections[patt.connections.length-1].target, result);
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

    describe('# process stitch groups', function () {
	it('should parse stitch groups with single stitch', function () {
	    ast = p.parse("Row 1: ch3. Row 2: ch, sc, (sc), sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 7);
	    assert.equal(patt.connections.length, 9);
	    assert.notEqual(patt.connections[8].target, undefined);
	});
	it('should parse stitch groups with multiple longhand stitches', function () {
	    ast = p.parse("Row 1: ch3. Row 2: ch, sc, (sc, ch, sc), sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 9);
	    assert.equal(patt.connections.length, 12);
	    assert.notEqual(patt.connections[11].target, undefined);
	});
	it('should parse stitch groups with single st-num stitch', function () {
	    ast = p.parse("Row 1: ch3. Row 2: ch, sc, (sc3), sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 9);
	    assert.equal(patt.connections.length, 13);
	    assert.notEqual(patt.connections[12].target, undefined);
	});
	it('should parse stitch groups with multiple st-num stitches', function () {
	    ast = p.parse("Row 1: ch3. Row 2: ch, sc, (sc2, hdc, sc2), sc.");
	    //console.log(ast.toString());
	    patt = i.interpret(ast);
	    assert.equal(patt.stitches.length, 11);
	    assert.equal(patt.connections.length, 17);
	    assert.notEqual(patt.connections[16].target, undefined);
	});
    });


    
});
