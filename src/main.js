// from chain-space folder command prompt  -  $ browserify src/main.js -o app.js

var $ = require('jquery');
var d3 = require('d3');
var filesaver = require('filesaver');
var parser = require('./parser');
var interpreter = require('./interpreter');
var swatchlist = require('./swatches');
var stitchlist = require('./stitches');
var p = new parser.Parser();
var swatches = swatchlist.swatches;
var stitches = stitchlist.stitches;

var main = function(){
    'use strict';

    // set-up formatting
    $('.full-height').height($('.main').parent().height());
    $('#pattern-text').height($('.left-column').height()/2);
    $('.right-column').children().toggle(false);
    $('#info').toggle(true);
    $('#stitches').toggle(false);

    //activate event listeners
    $('#logo').click(function(){
	location.reload(true);
    });

    $('.button-bar').children().click(function(){
	$('.right-column').children().toggle(false);
	//activate the corresponding screen, depends on naming convention 'x-button' being the button for screen 'x'
	var buttonid = this.id;
	var screenid = '#' + buttonid.substring(0, buttonid.length-7);
	$(screenid).toggle(true); 
    });

    $('#granite').click(function(){
	$('#pattern-text').val(swatches[ 'granite']);
    });
    $('#griddle').click(function(){
	$('#pattern-text').val(swatches[ 'griddle']);
    });
    $('#shells').click(function(){
	$('#pattern-text').val(swatches[ 'shells']);
    });
    
    $('#create').click(function(){
	var text = $('#pattern-text').val();
	console.log(text);
	var ast = p.parse(text);
	//console.log(ast);
	var pattern = interpreter.interpret(ast);
	var nodes = pattern.stitches;
	var links = pattern.connections;
	//console.log(nodes);
	//console.log(links);
	var stitchtypes = {};
	for (var key in nodes) {
	    if (nodes[key].type in stitchtypes) { stitchtypes[nodes[key].type]++; }
	    else { stitchtypes[nodes[key].type] = 0; }
	};
	//console.log(stitchtypes);
	$('#stitches-list').html('');
	for (var key in stitchtypes) {
	    $('#stitches-list').append('<li><div style="display: inline-block;"><span> ' + key + '</span><div style="display: inline-block;"><svg height="30" width="30"><g transform="translate(15,15)">' +stitches[key] + '</g></svg></div>' + '</div> </li>');
	};
	$('#pattern-text').height($('.left-column').height()/3);
	$('#stitches').toggle(true);
	
	//Create svg frame and clear any previous chart elements
	$('.right-column').children().toggle(false);
	$('#chart').toggle(true);
	var frame = d3.select('#frame');
	frame.selectAll('g').remove();
	frame.selectAll('line').remove();
	
	// Create chart (force layout)
	var chart = d3.layout.force()
	    .nodes(nodes) 
	    .links(links) 
	    .size([$('#chart').width(), $('#chart').height()])
	    .linkDistance(20)
	    .charge(-100)
	    .on('tick', tick); //calculate movement

	var link = frame.selectAll('.link') // converting links to svg lines
	    .data(links)
	    .enter().append('line')
	    .attr('class', 'link');
	//console.log(link);

	var node = frame.selectAll('.node') // converting nodes to g blocks 
	    .data(nodes)
	    .enter().append('g')
	    .html( function(d) {return stitches[d.type]})
	    .attr('class', 'node')
	    .style('stroke', function(d){if (d.row%2 == 1) return '#000000'; else return '#0000FF'; } )
	    .call(chart.drag);
	
	chart.start();
	console.log(nodes);
	//console.log(links);
	function tick() {    
	    frame.selectAll('.link')
		.attr('x1', function(d) { return d.source.x; })
		.attr('y1', function(d) { return d.source.y; })
		.attr('x2', function(d) { return d.target.x; })
		.attr('y2', function(d) { return d.target.y; });	

	    frame.selectAll('.node')
		.attr('transform', function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	}
	
	$('#save').click(function(){
	var svgData = $("#chart").html();
	console.log(svgData);
	var blob = new Blob([svgData], {type: "image/svg+xml;charset=utf-8"});
	filesaver.saveAs(blob, "chart.svg");
	});
/*

	    var html = d3.select("#frame")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

	console.log(html);
	var imgsrc = 'data:image/svg+xml;base64,'+ btoa(html);
	var img = '<img src="'+imgsrc+'">'; 
	d3.select("#enter-pattern").html(img);
*/
    });
};

$(document).ready(main);
