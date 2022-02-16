const WAVES = 7;

var canvas;

var elapsedTime = 0;

var skyTop;
var skyBot;

var seedstars = 0;
var stars = 0;


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  waveSize = windowWidth / WAVES;
}

function setup() {
  //CANVAS
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');

  //STARS
  seedstars = random(1000);
  stars = 1 + random(80);

  //SKY
  skyTop = color(120, 160, 220);
  skyBot = color(20, 20, 120);

  //WAVES
  waveSize = windowWidth / WAVES;
}

function mousePressed() {
  seedstars = random(1000);
  stars = 1 + random(80);
}

function draw() {
  background(220);

  drawSky();

  for (i = 0; i < stars; i++) {
    drawStars(
      noise(seedstars + i * 1000) * (windowWidth * 2) - windowWidth / 2,
      noise(seedstars + 1000 + i * 1000) * (windowHeight * 2) - windowHeight / 2
    );
  }

  rows = 21;

  for (y = 0; y < rows; y++) {
    waveCol = color(0, 100 + y * 4, 129);
    c = lerpColor(waveCol, color(20, 20, 120), 1 - y / rows);
    drawWaves(0, windowHeight - rows * 10 + y * waveSize / 8 + 5, c);
  }

  elapsedTime += deltaTime;
}

//Draws the sky by creating a gradient formed from individual lines.
function drawSky() {
  for (y = 0; y < windowHeight; y++) {
    newY = map(0, windowHeight - windowHeight * 0.1, 0, windowHeight, y, true);


    c = color(lerpColor(skyTop, skyBot, newY / windowHeight));
    stroke(c);

    line(0, y, windowWidth, y);
  }
}

function drawStars(x, y) {
  noStroke();
  fill(255, 255, 255);

  circle(x, y, 1 + random(2));
}

function drawWaves(x, y, c) {
  noStroke();
  fill(c);

  speed = 0.0002;

  offsetX =
    waveSize / 2 + sin(((elapsedTime * speed * y) / windowHeight) * 10) * 20;
  offsetY = waveSize;

  for (i = 0; i < WAVES; i++) {
    circle(
      i * waveSize + offsetX,
      y + offsetY,
      waveSize + (y / windowHeight) * 100
    );
  }
}
