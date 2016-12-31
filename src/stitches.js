var stitches = {
    ch: '<ellipse class="stitch" type="ch" cx=0 cy=0 rx=8 ry=4>',
    sc: '<g class="stitch" type="sc"> <path class="scpath1" d="m 0,-10 0,20" /> <path class="scpath2" d="m -7,0 14,0" /> </g>',
    hdc: '<g class="stitch" type="hdc"> <path class="hdcpath1" d="m 0,0 0,20"/> <path class="hdcpath2" d="m -7,0 14,0" /> </g>',
    dc: '<g class="stitch" type="dc"> <path class="dcpath1" d="m 0,0 0,40"/> <path class="dcpath2" d="m -7,0 14,0" /> <path class="dcpath3" d="m -4,9 8,0" /> </g>'
};

module.exports.stitches = stitches;
