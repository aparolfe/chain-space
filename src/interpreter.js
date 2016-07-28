exports.interpret =  function(ast) {
    var nodes=[]; // array of objects, attrs: x, y, id, type
    var links=[]; // also array of objects, attrs: source, target, x1,y1,x2,y2 because of lines

    var rows = ast.children;
    var stcount = 0; //total number of stitches in the pattern (number of nodes)
    var linkcount = 0; // total number of links in pattern
    var firstrow = 0;
    var targetindex = 0; //index of stitch being worked in (after first row)

    for (var i = 0; i < rows.length; i++) { //iterate over rows
	var contents = rows[i].children;
	var rownum = 0;
	var stnum = 0;
	if (i !==0) { // all rows except the first row
	    targetindex = stcount - 1; //make last stitch of last row the target stitch
	}
	// replace any st-grp notations with stitches marked as target:same
	var tempcontents=[]; //rewrite into new array because array length might change
	for (var j = 0; j < contents.length; j++) { //iterate over row contents
	    var st = contents[j];
	    if (st instanceof Object && st.type == "stgrp") { // if st-grp found
		var group = st.children;
		group.shift();	//strip parens
		group.pop();
		for (var jj=0; jj<group.length-1; jj++) { // iterate over all but the last st in grp
		    group[jj].target = 'same'; //all but last st marked and pushed
		    tempcontents.push(group[jj]);
		}
		var lastst = group[group.length-1];
		if (lastst.children[lastst.children.length-1] instanceof Object) { // if lastst is in st-num format
		    var repnum = parseInt(lastst.children[lastst.children.length-1].children.join(""),10);
		    lastst.children.pop(); 				 // remove num from end of st
		    var copyst = JSON.parse(JSON.stringify(lastst)); //copy by value instead of creating a pointer
		    copyst.target = 'same';
		    for (var jjj = 0; jjj < repnum - 1; jjj++) { // push num-1 reps of marked st
			tempcontents.push(copyst);
		    }
		    lastst.target = 'next';
		    console.log(lastst);
		    tempcontents.push(lastst); // last st pushed is unmarked
		}
		else tempcontents.push(lastst); 
		console.log(tempcontents);
	    }
	    else tempcontents.push(st);
	}
	// replace any st-num notations in the row with longhand
	var newcontents=[]; //rewrite into new array because array length might change
	for (var j = 0; j < tempcontents.length; j++) { //iterate over row contents
	    var st = tempcontents[j];
	    if (st instanceof Object && st.type == "st" && st.children[st.children.length-1] instanceof Object) { // if st is in st-num format
		var strepnum = parseInt(st.children[st.children.length-1].children.join(""),10);
		st.children.pop(); 				 // remove num from end of st
		for (var jj = 0; jj < strepnum; jj++) { // replace by num reps of st
		    newcontents.push(st);
		}
	    }
	    else newcontents.push(st);
	}
	// interpret the row
	for (var k = 0; k < newcontents.length; k++) { //iterate over row contents
	    var st = newcontents[k];
	    var node = {}; //each stitch will be a node
	    if (st instanceof Object) {
		if (st.type == "num") { // find the row number
		    rownum = parseInt(st.children.join(""),10); // assigns row number
		    if (i == 0) { firstrow = rownum; }
		}
		if  (st.type == "st") {
		    //add node
		    stnum++;
		    node.row = rownum;
		    node.st = stnum;
		    node.type = st.children.join('').toLowerCase();
		    nodes[stcount] = node;
		    stcount++;
		    //add links
		    if (stnum !== 1 || rownum !== firstrow) { //not the very first st
			links[linkcount] = {source: node, target: nodes[stcount-2]};// link to prev st
			linkcount++;			
		    }
		    if (rownum !== firstrow && node.type !== "ch") { // not first row and not ch
			links[linkcount] = {source: node, target: nodes[targetindex]};// link to target st
			linkcount++;
			if (st.target !== "same") targetindex--; //move target unless next st should be worked in same st
		    }
		}
		if  (st.type == "keyword") {
		    switch(st.children.join('').toLowerCase()) {
		    case "sk":
			targetindex--;
			break;
		    case "skip":
			targetindex--;
			break;
		    case "turn":
			//do nothing until rnd or short row support added
			break;
		    }
		}
		
	    }
	}
    }
    return {stitches: nodes, connections:links};
};
