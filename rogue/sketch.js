
var elapsedTime = 0;

var cols, rows;
var scl = 20;
var w = 1400;
var h = 1000;

var noiseScale = 0.1;

var colTop;
var colBot;

var flying = 0;

var terrain = [];

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  //CANVAS
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');

  //BACKGROUND
  colTop = color(190, 176, 244);
  colBot = color(25, 75, 168);

  //GRID
  w = windowWidth;
  h = windowHeight;
  cols = w / scl;
  rows = h / scl;

  for (var x = 0; x < cols; x++) {
    terrain[x] = [];
    for (var y = 0; y < rows; y++) {
      terrain[x][y] = 0; //specify a default value for now
    }
  }
}

function draw() {
  push();
  flying -= 0.1;
  var xoff = sin(elapsedTime * 0.002);
  var yoff = 0;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < cols; x++) {
      terrain[x][y] = map(noise(xoff * noiseScale, yoff * noiseScale), 0, 1, -100, 100);
      xoff += noiseScale;
    }
    yoff += noiseScale;
  }

  stroke(0, 120, 255);
  strokeWeight(4);
  noFill();
  drawBackground();

  translate(-windowWidth / 2, -windowHeight / 3);
  //translate(0,100);
  rotateX(PI / 3);

  for (var y = 0; y < rows - 1; y++) {
    beginShape(QUAD_STRIP);
    for (var x = 0; x < cols; x++) {
      stroke(sin(elapsedTime*0.001)*100,0,y*10);
      vertex(x * scl, y * scl, terrain[x][y]);
      vertex(x * scl, (y + 1) * scl, terrain[x][y + 1]);
    }
    endShape();
  }
  elapsedTime += deltaTime;
  pop();
}

function drawBackground() {
  push();
  translate(-windowWidth / 2, -windowHeight / 2);
  for (y = 0; y < windowHeight; y++) {
    newY = map(0, windowHeight - windowHeight * 0.1, 0, windowHeight, y, true);


    c = color(lerpColor(colTop, colBot, newY / windowHeight));
    stroke(c);

    line(0, y, windowWidth, y);
  }
  pop();
}

function drawGrid() {

}