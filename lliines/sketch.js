//GENERAL
var canvas;
var elapsedTime = 0;

//SPECIFIC
var lines = 64;
var lineDist = 1; //Distance between lines
var lineNoiseScale = 10;
var speed = 0.001;
var dls = [];

var bgcolor;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  //REDEFINE LINES
  dls = [];
  for (var i = 0; i < lines; i++) {
    dl = new DynamicLine(-windowWidth / 2, pow(i * lineDist, 1.5), windowWidth / 2, pow(i * lineDist, 1.5), 18, i);
    dls.push(dl);
  }

  for (var i = 0; i < dls.length; i++) {
    dls[i].initSegments();
  }
}

function mouseClicked(){
  bgcolor = color(270, random(0, 255), random(0, 255));
}

function setup() {
  //CANVAS
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  colorMode(HSB);
  canvas.push();

  //BACKGROUND
  bgcolor = color(270, random(0, 255), random(0, 255));
  background(bgcolor);

  //LINES
  for (var i = 0; i < lines; i++) {
    dl = new DynamicLine(-windowWidth / 2, pow(i * lineDist, 1.5), windowWidth / 2, pow(i * lineDist, 1.5), 18, i);
    dls.push(dl);
  }

  for (var i = 0; i < dls.length; i++) {
    dls[i].initSegments();
  }
}

function draw() {
  //BACKGROUND
  background(bgcolor);

  //LINES
  for (var i = 0; i < dls.length; i++) {
    dls[i].update();
  }

  elapsedTime += deltaTime;
}

function DynamicLine(originX, originY, targetX, targetY, segments, zpos) {
  this.origin = createVector(originX, originY);
  this.target = createVector(targetX, targetY);
  this.points = [];
  this.pointsT = [];  //Translated point positions
  this.zpos = zpos; //Faked z position

  this.initSegments = function () {
    var dir = createVector(this.target.x - this.origin.x, this.target.y - this.origin.y);

    this.points.push(this.origin);
    for (var i = 0; i < segments; i++) {
      var v = createVector(
        this.points[i].x + dir.x / segments,
        this.points[i].y + dir.y / segments
      );
      this.points.push(v);
    }
  }

  this.update = function () {
    this.updatePoints();
    this.drawLine();
    //this.drawPoints();
  };

  this.updatePoints = function () {
    for (var i = 0; i < this.points.length; i++) {
      this.pointsT[i] = createVector(
        this.points[i].x,
        this.points[i].y + noise(this.points[i].x + elapsedTime * speed, this.points[i].y) * lineNoiseScale)
    }
  };

  this.drawLine = function () {
    push();

    c = color(270, 100, lines / this.zpos * 10);

    //lc = color(lerp(270, 180, this.zpos / lines * 1), 100, 100);

    lc = lerpColor(bgcolor, c, this.zpos / lines);

    stroke(lc);
    strokeWeight(11);

    for (var i = 0; i < this.points.length - 1; i++) {
      line(this.pointsT[i].x, this.pointsT[i].y, this.pointsT[i + 1].x, this.pointsT[i + 1].y);
    }

    pop();
  };


  this.drawPoints = function () {
    push();
    noStroke();

    for (var i = 0; i < this.points.length; i++) {
      circle(this.pointsT[i].x, this.pointsT[i].y, 10);
    }

    pop();
  };
}