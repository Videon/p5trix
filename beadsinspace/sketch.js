var canvas;

var seed;
var elapsedTime = 0;

var mulR = 255;
var mulG = 0;
var mulB = 0;

var bgHue = 0;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  //CANVAS
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');

  seed = random(1000);
}

function mousePressed(){
  setColorMultipliers();
  bgHue = random(100);
}

function setColorMultipliers() {
  mulR = random(255);
  mulG = random(255);
  mulB = random(255);
}

function draw() {
  var windowSizeFactor = int(windowHeight/50);
  drawBackground(windowSizeFactor);

  for (y = 0; y < windowSizeFactor; y++) {
    for (x = 0; x < windowSizeFactor; x++) {
      drawCircles(windowWidth / 2, (y * windowWidth) / 8, x * elapsedTime);
    }
  }

  elapsedTime += deltaTime;
}

function drawCircles(posX, posY, t) {
  var speed = 0.00004;
  var ts = sin(t * speed) * 1000; //Current speed adjusted time
  var size = windowWidth / 8;

  colorMode(RGB, 255);
  noStroke();

  fill(color(sin(t * speed) * mulR, mulG, mulB));
  circle(
    -mouseX * 0.1 - windowWidth / 2 + posX + ts,
    -mouseY * 0.1 + posY,
    size
  );
  circle(
    -mouseX * 0.1 - windowWidth / 2 + posX - ts,
    -mouseY * 0.1 + posY,
    size
  );
}

function drawBackground(levels) {
  var sizeFactor = windowWidth / 8;

  colorMode(HSB, 100);
  noStroke();
  

  for (i = 0; i < levels; i++) {
    fill(bgHue, 100, i * 10 * sin(elapsedTime * 0.01 + i * 0.2));
    size = sizeFactor * (levels - i);

    rect(
      windowWidth / 2 - size / 2, //xPos
      windowHeight / 2 - size / 2, //yPos
      size
    );
  }
}
