var noiseScale = 0.01;

var wooshes = [];
var elapsedTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(random(255),random(255),random(255));
}

function draw() {
  cleanUp();

  for (var i = 0; i < wooshes.length; i++) {
    wooshes[i].update();
  }

  elapsedTime += deltaTime;
}

function mousePressed() {
  var w = new Woosh(mouseX, mouseY);
  wooshes.push(w);
}

function cleanUp() {
  for (var i = wooshes.length - 1; i >= 0; i--) {
    if (wooshes[i].isDone()) {
      wooshes.splice(i, 1);
    }
  }
}

function drawBackground(){

}