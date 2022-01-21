//originally meant as a forest generator, now silhouette scape

var canvas;

var rndSeed;


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawSky();
  drawForest();
}

function setup() {
  //CANVAS
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');

  skyTop = color(255, 255, 255);
  skyBot = color(20, 20, 120);

  background(0);
  randomSeed(random(0, 10));

  rndSeed = random(0, 999999);

  drawSky();
  drawForest();
}

function mousePressed() {
  rndSeed = random(0, 999999);

  drawSky();
  drawForest();
}

function drawForest() {
  for (let i = 0; i < 100; i++) {
    var posX = noise(i * 14 + rndSeed) * windowWidth;
    var posY = windowHeight - noise(i + rndSeed) * windowHeight;
    drawTree(posX, posY);
  }
}

function drawTree(posX, posY) {
  //draw stem
  var length = 100;
  var start = createVector(posX, posY);
  var end = createVector(posX, posY - length);
  //drawSegment(start, end, 2);
  //draw branches
  for (let k = 0; k < 140; k++) {
    drawSegment(
      createVector(start.x - k * 2, end.y + 5 * k),
      createVector(start.x + k * 2, end.y + 5 * k),
      2
    );
  }
}

function drawSegment(start, end, thickness) {
  stroke(thickness);
  line(start.x, start.y, end.x, end.y);
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
