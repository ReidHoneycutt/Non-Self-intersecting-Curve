let W = window.innerWidth;
let H = window.innerHeight;
let r = 8;
let curve;
let l;
let PATH_WIDTH = 2;
let AREA = W*H;


function setup() {
    createCanvas(W, H);
    curve = new Curve(r, 10000, createVector(W/2, H/2));
}

function draw() {
    curve.show();
    curve.find_new_seg2();
}

function mouseClicked() {
    curve = new Curve(r, 10000, createVector(mouseX, mouseY));
}

function doubleClicked() {
    noLoop();
}
