var canvas;
var points = 240;
var col;

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

function setup() {
  //CANVAS
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');

  col = color(0,0,0);
}

function mouseMoved(){
  col = color(random(0,255),random(0,255),random(0,255));
}

function draw() {
  //background(220, 110, 55);
  //points = noise(mouseX,mouseY)*360;
stroke(col);
  corona();
}

function corona() {
  var midPoint = createVector(mouseX, mouseY);
  var startPoints = [];
  var endPoints = [];
  startPoints.length = points;
  endPoints.length = points;

  size = 50;
  size = mouseY/windowHeight*50;

  segrad = 2 * PI / points;

  for (var i = 0; i < startPoints.length; i++) {
    startPoints[i] = createVector(
      midPoint.x + cos(segrad * i) * size,
      midPoint.y + sin(segrad * i) * size
    );

    endPoints[i] = createVector(
      midPoint.x + cos(segrad * i) * size * 100,
      midPoint.y + sin(segrad * i) * size * 100
    );
  }

  //Draw lines
  for (i = 0; i < startPoints.length; i++) {
    line(startPoints[i].x, startPoints[i].y,
      endPoints[i].x, endPoints[i].y);
  }
}
