// from chain-space folder command prompt  -  $ browserify src/main.js -o app.js

var $ = require('jquery');
var d3 = require("d3");
var parser = require('./parser');
var interpreter = require('./interpreter');
var p = new parser.Parser();

var main = function(){
    "use strict";
    $('.right-column').children().toggle(false);
    $('#info').toggle(true);
    
    $(".full-height").height($(".main").parent().height());
    $("#faq-button").click(function(){
	$('.right-column').children().toggle(false);
	$('#faq').toggle(true);
    });
    $("#info-button").click(function(){
	$('.right-column').children().toggle(false);
	$('#info').toggle(true);
    });
    $("#about-button").click(function(){
	$('.right-column').children().toggle(false);
	$('#about').toggle(true);
    });
    
    $("#create").click(function(){
	var text = $("#pattern-text").val();
	console.log(text);
	var ast = p.parse(text);
	console.log(ast);
	var pattern = interpreter.interpret(ast);
	var nodes = pattern.stitches;
	var links = pattern.connections;
	console.log(nodes);
	console.log(links);
	
	//Create svg frame
	$('.right-column').children().toggle(false);
	$('#chart').toggle(true);
	var frame = d3.select("#frame");

	// Create chart (force layout)
	var chart = d3.layout.force()
	    .nodes(nodes) 
	    .links(links) 
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

$(document).ready(main);
