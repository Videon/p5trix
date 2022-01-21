//place oscillating droplets. mouse movement affects droplet size.
//left click to place

var canvas;

var elapsedTime = 0;
var drops = [];
var noiseScale = 0.1;
var sizeFactor = 200;
var pushFactor = 100;
var mousePos;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
    //CANVAS
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
}

function draw() {
  mousePos = createVector(mouseX,mouseY);
  
  background(noise(elapsedTime * 0.001) * 255, 255, 255);

  elapsedTime += deltaTime;
  noStroke();
  for (i = 0; i < drops.length; i++) {
    drops[i].update();
  }

  sizeFactor = noise(mouseX * 0.001, mouseY * 0.001) * 300;
}

function mousePressed(){
  d = new Drop(mouseX,mouseY);
  drops.push(d);
}

function Drop(x, y) {
  this.startTime = elapsedTime;// + random(10000);
  this.color = color(random(255), random(255), random(255));
  this.position = createVector(x,y);

  this.update = function () {
    mouseVec = createVector(this.position-mousePos);
    
    distFactor = dist(mouseX, mouseY, x, y);
    //this.position.x = x-mouseVec.x*(pushFactor-constrain(distFactor,0,pushFactor));
  
    //this.position.y = y-mouseVec.y*(pushFactor-constrain(distFactor,0,pushFactor));

    fill(this.color);
    size =
      noise(this.position.x * noiseScale, this.position.y * noiseScale) * sizeFactor +
      sin((elapsedTime - this.startTime) * 0.01) * 10;
    circle(this.position.x, this.position.y, size);
  };
}
