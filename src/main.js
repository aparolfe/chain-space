// from chain-space folder command prompt  -  $ browserify src/main.js -o app.js

//var $ = require('jquery');
//var foundation = require('foundation');
var d3 = require("d3");
var parser = require('./parser');
var p = new parser.Parser();

var main = function(){
    "use strict";
    $(".full-height").height($(".main").parent().height());
    $("#magic").click(function(){
	var text = $("#pattern-text").val();
	console.log(text);
	var ast = p.parse(text);
	console.log(ast);
	var nodes=[], // array of objects, attrs: x, y, id, type
	    links=[]; // also array of objects, attrs: source, target, x1,y1,x2,y2 because of lines

	// interpreter code
	var rows = ast.children;
	var stcount = 0; //total number of stitches in the pattern (number of nodes)
	var linkcount = 0; // total number of links in pattern
	var firstrow = 0;

	for (var i = 0; i < rows.length; i++) { //iterate over rows
	    var contents = rows[i].children;
	    var rownum = 0;
	    var stnum = 0;
	    for (var j = 0; j < contents.length; j++) { //iterate over row contents
		var st = contents[j];
		var node = {}; //each stitch will be a node
		if (st instanceof Object) {
		    if (st.type == "num") { // find the row number
			rownum = parseInt(st.children[0],10); // assigns row number
			if (i==0) { firstrow = rownum; }
		    }
		    if  (st.type == "st") {
			//add node
			stnum++;
			node.row = rownum;
			node.st = stnum;
			node.type = st.children.join('');
			nodes[stcount] = node;
			stcount++;
			//add links
			if (stnum !== 1 || rownum !== firstrow) { //not the very first st
			    links[linkcount] = {source: node, target: nodes[stcount-2]};// link to prev st
			    linkcount++;
			}
		    }
		}
	    }
	}

	console.log(nodes);
	console.log(links);
	//end interpreter code 
	
	//Create svg frame
	var frame = d3.select("#frame");

	// Create chart (force layout)
	var chart = d3.layout.force()
	    .nodes(nodes) // empty
	    .links(links) //empty
	    .size([$("#chart").width(), $("#chart").height()])
	    .linkDistance(30)
	    .charge(-60)
	    .on("tick", tick); //calculate movement

	chart.start();
	console.log(nodes);
	console.log(links);
	var link = frame.selectAll(".link") // converting links to svg lines
	    .data(links)
	    .enter().append("line")
	    .attr("class", "link");
	console.log(link);

	var node = frame.selectAll(".node") // converting nodes to g blocks 
	    .data(nodes)
	    .enter().append("g")
	    .html( function(d) {return chooseStitch(d.type)})
	    .attr("class", "node")
	    .call(chart.drag);

	function chooseStitch(st) {//given string, returns appropriate g html
	    switch(st) {
	    case "ch":
		return '<ellipse class="stitch" type="ch" cx=0 cy=0 rx=8 ry=4> </g>';
	    case "sc":
		return '<g class="stitch" type="sc"> <path class="scpath1" d="m 0,-10 0,20" /> <path class="scpath2" d="m -7,0 14,0" /> </g>';
	    case "hdc":
		return '<g class="stitch" type="hdc"> <path class="hdcpath1" d="m 0,0 0,20"/> <path class="hdcpath2" d="m -7,0 14,0" /> </g>';
	    }
	};
	
	function tick() {    
	    frame.selectAll(".link")
		.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });	

	    frame.selectAll(".node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
    });
};

$(document).foundation();
    $(document).foundation({
  accordion: {
    content_class: 'content',    // specify the class used for accordion panels   
    active_class: 'active', // specify the class used for active (or open) accordion panels
    multi_expand: true,      // allow multiple accordion panels to be active at the same time
    toggleable: true    // allow accordion panels to be closed by clicking on their headers
  }
});
$(document).ready(main);
