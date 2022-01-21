var canvas;

var circleSize = 50;
var color1;
var color2;
var colorBg;

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

function setup() {
  //CANVAS
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.style('z-index','-1');

  //Set random value

  //Set colors
  setColors();
}

function setColors() {
  r = random(100);

  colorMode(HSB, 100);
  color1 = color(r, r, 100);
  color2 = color((r + 50) % 100, r, 100);
  colorBg = color(0, 0, 100 - r);
}

function mousePressed(){
  setColors();
}

function draw() {
  background(colorBg);

  drawCircles();
}

function drawCircles() {
  sizeX = Math.floor(windowWidth / circleSize);
  sizeY = Math.floor(windowHeight / circleSize);

  offsetX = circleSize / 2;
  offsetY = circleSize / 2;

  var colorSwitch = false;
  fill(color2);

  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      if (colorSwitch) fill(color1);
      else fill(color2);
      colorSwitch = !colorSwitch;
      //Calculate circle position
      posX = offsetX + circleSize * x;
      posY = offsetY + circleSize * y;

      //Calculate circle size

      circle(posX, posY, dist(posX, posY, mouseX, mouseY));
    }
  }
}
