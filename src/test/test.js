// from src folder command prompt  -  $ mocha

var assert = require("assert");
var parser = require('../parser');
var p = new parser.Parser();

describe('Parser', function() {
describe('#parse()', function () {
	it('should not return null when input is Row 1: sc.', function () {
	    assert(p.parse("Row 1: sc."));
	    });
    });
});

describe('Array', function() {
describe('#indexOf()', function () {
	it('should return -1 when positive value is not present', function () {
		assert.equal(-1, [1,2,3].indexOf(5));
	    });
	it('should return -1 when zero value is not present', function () {
		assert.equal(-1, [1,2,3].indexOf(0));
	    });
	it('should return -1 when negative value is not present', function () {
		assert.equal(-1, [1,2,3].indexOf(-5));
	    });
    });
});
