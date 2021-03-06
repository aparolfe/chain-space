// from chain-space folder command prompt  -  $ browserify src/main.js -o app.js

var $ = require('jquery');
var d3 = require('d3');
var filesaver = require('filesaver');
var seedrandom = require('seedrandom');
var parser = require('./parser');
var interpreter = require('./interpreter');
var swatches = require('./swatches');
var stitches = require('./stitches');
var p = new parser.Parser();

var main = function(){
    'use strict';

    // set-up formatting
    $('.full-height').height($('.main').parent().height());
    $('#pattern-text').height($('.left-column').height()/2);
    $('.right-column').children().toggle(false);
    //populate examples list, naming convention 'key' in swatches file creates link 'Key stitch' on page
    for (var key in swatches) {
	var capkey = key.charAt(0).toUpperCase() + key.slice(1);
	$('#swatches-list').append('<li class="swatch-link" id="'+ key +'"> ' + capkey + ' stitch </li>');
	$('#'+key).click(function(){
	    $('#pattern-text').val(swatches[this.id]);
	});
    };
    $('#info').toggle(true);
    $('#stitches').toggle(false);

    // activate event listeners
    $('#logo').click(function(){
	location.reload(true);
    });

    $('.button-bar').children().click(function(){ // activate navigation-bar buttons
	$('.right-column').children().toggle(false);
	// activate the corresponding screen, naming convention 'x-button' is the button for screen 'x'
	var buttonid = this.id;
	var screenid = '#' + buttonid.substring(0, buttonid.length-7);
	$(screenid).toggle(true); 
    });

    // generate chart when the "Create Chart" button is pressed
    $('#create').click(function(){
	var text = $('#pattern-text').val();
	var ast = p.parse(text);
	var pattern = interpreter.interpret(ast);
	var nodes = pattern.stitches;
	var links = pattern.connections;
	var stitchtypes = {};
	for (var key in nodes) {	// generate key showing all the stitches used in the pattern
	    if (nodes[key].type in stitchtypes) { stitchtypes[nodes[key].type]++; }
	    else { stitchtypes[nodes[key].type] = 0; }
	};
	$('#stitches-list').html('');
	for (var key in stitchtypes) {
	    $('#stitches-list').append('<li><div style="display: inline-block; height=50px; width=50px; "><span> ' + key + '</span><div style="display: inline-block;"><svg height="50" width="50"><g transform="translate(15,15)">' +stitches[key] + '</g></svg></div>' + '</div> </li>');
	};
	$('#pattern-text').height($('.left-column').height()/3);
	$('#stitches').toggle(true);
	
	// Create svg frame and clear any previous chart elements
	$('.right-column').children().toggle(false);
	$('#chart').toggle(true);
	var frame = d3.select('#frame');
	frame.selectAll('g').remove();
	frame.selectAll('line').remove();
	
	// Create chart (force layout)
	Math.seedrandom('mySeed');
	var chart = d3.layout.force()
	    .nodes(nodes) 
	    .links(links) 
	    .size([$('#chart').width(), $('#chart').height()])
	    .linkDistance(20)
	    .charge(-100)
	    .on('tick', tick) //calculate movement
	    .start();

	var node = frame.selectAll('.node') // convert nodes to g blocks 
	    .data(nodes)
	    .enter().append('g')
	    .html( function(d) {return stitches[d.type]})
	    .attr('class', 'node')
	    .style('stroke', function(d){if (d.row%2 == 1) return '#000000'; else return '#0000FF'; } ) // set st color by row
	    .call(chart.drag);

	var link = frame.selectAll('.link') // convert links to svg lines
	    .data(links)
	    .enter().append('line')
	    .attr('class', 'link');
	
	var centerrow = (nodes[nodes.length-1].row)/2;
	function tick(e) {    
	    frame.selectAll('.link') // move links
		.attr('x1', function(d) { return d.source.x; })
		.attr('y1', function(d) { return d.source.y; })
		.attr('x2', function(d) { return d.target.x; })
		.attr('y2', function(d) { return d.target.y; });	
	    var xstretch = 20 * e.alpha;
	    var ystretch = 6 * e.alpha;
	    nodes.forEach(function(d, i) {
		d.x += (d.row % 2) ? xstretch/d.st: -xstretch/d.st; // x-pull based on row direction and st num
		d.y += (centerrow-d.row)*ystretch; 			// y-pull based on row
	    });
	    frame.selectAll('.node') // move nodes
	        .attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	
	$('#save').click(function(){ // activate Save Chart button
	var svgData = $("#chart").html();
	console.log(svgData);
	var blob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
	filesaver.saveAs(blob, "chart.svg");
	});
    });
};

$(document).ready(main);
