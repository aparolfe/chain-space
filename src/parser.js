/*
 * Generated by the Waxeye Parser Generator - version 0.8.1
 * www.waxeye.org
 */

var waxeye = waxeye;
if (typeof module !== 'undefined') {
    // require from module system
    waxeye = require('waxeye');
}

var Parser = (function() {

    var parser = function() { return this; };
    parser.prototype = new waxeye.WaxeyeParser(0, true, [new waxeye.FA("patt", [new waxeye.State([new waxeye.Edge(5, 1, false)], false),
            new waxeye.State([new waxeye.Edge(1, 2, false)], false),
            new waxeye.State([new waxeye.Edge(5, 3, false)], true),
            new waxeye.State([new waxeye.Edge(1, 2, false)], false)], waxeye.FA.LEFT),
        new waxeye.FA("row", [new waxeye.State([new waxeye.Edge(["R", "r"], 1, false)], false),
            new waxeye.State([new waxeye.Edge(["O", "o"], 2, false)], false),
            new waxeye.State([new waxeye.Edge(["W", "w"], 3, false)], false),
            new waxeye.State([new waxeye.Edge(5, 4, false)], false),
            new waxeye.State([new waxeye.Edge(4, 5, false)], false),
            new waxeye.State([new waxeye.Edge(5, 6, false)], false),
            new waxeye.State([new waxeye.Edge(2, 7, false)], false),
            new waxeye.State([new waxeye.Edge(5, 8, false)], false),
            new waxeye.State([new waxeye.Edge(2, 7, false)], true)], waxeye.FA.LEFT),
        new waxeye.FA("st", [new waxeye.State([new waxeye.Edge(["C", "c"], 1, false),
                new waxeye.Edge(["S", "s"], 3, false),
                new waxeye.Edge(["H", "h"], 4, false)], false),
            new waxeye.State([new waxeye.Edge(["H", "h"], 2, false)], false),
            new waxeye.State([], true),
            new waxeye.State([new waxeye.Edge(["C", "c"], 2, false)], false),
            new waxeye.State([new waxeye.Edge(["D", "d"], 5, false)], false),
            new waxeye.State([new waxeye.Edge(["C", "c"], 6, false)], false),
            new waxeye.State([new waxeye.Edge(5, 2, false)], false)], waxeye.FA.LEFT),
        new waxeye.FA("keyword", [new waxeye.State([new waxeye.Edge(["T", "t"], 1, false),
                new waxeye.Edge(["S", "s"], 5, false),
                new waxeye.Edge(["I", "i"], 8, false),
                new waxeye.Edge(["N", "n"], 9, false),
                new waxeye.Edge(["S", "s"], 12, false)], false),
            new waxeye.State([new waxeye.Edge(["U", "u"], 2, false)], false),
            new waxeye.State([new waxeye.Edge(["R", "r"], 3, false)], false),
            new waxeye.State([new waxeye.Edge(["N", "n"], 4, false)], false),
            new waxeye.State([], true),
            new waxeye.State([new waxeye.Edge(["K", "k"], 6, false)], false),
            new waxeye.State([new waxeye.Edge(["I", "i"], 7, false)], false),
            new waxeye.State([new waxeye.Edge(["P", "p"], 4, false)], false),
            new waxeye.State([new waxeye.Edge(["N", "n"], 4, false)], false),
            new waxeye.State([new waxeye.Edge(["E", "e"], 10, false)], false),
            new waxeye.State([new waxeye.Edge(["X", "x"], 11, false)], false),
            new waxeye.State([new waxeye.Edge(["T", "t"], 4, false)], false),
            new waxeye.State([new waxeye.Edge(["A", "a"], 13, false)], false),
            new waxeye.State([new waxeye.Edge(["M", "m"], 14, false)], false),
            new waxeye.State([new waxeye.Edge(["E", "e"], 4, false)], false)], waxeye.FA.LEFT),
        new waxeye.FA("num", [new waxeye.State([new waxeye.Edge([[48, 57]], 1, false)], false),
            new waxeye.State([new waxeye.Edge([[48, 57]], 1, false),
                new waxeye.Edge(5, 2, false)], false),
            new waxeye.State([], true)], waxeye.FA.LEFT),
        new waxeye.FA("ws", [new waxeye.State([new waxeye.Edge([[9, 10], "\r", " ", ",", [46, 47], ":"], 0, false)], true)], waxeye.FA.VOID)]);
    return parser;
 
})();

// Add to module system
if (typeof module !== 'undefined') {
    module.exports.Parser = Parser;
}