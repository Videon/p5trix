var mainCanvas;

var elapsedTime = 0;
var col;

var flowers = [];

var wind;

function setup() {
  angleMode(DEGREES);
  createCanvas(windowWidth, windowHeight);
  mainCanvas = createGraphics(windowWidth, windowHeight);
  col = color(0, 0, 0);
}

function mousePressed() {
  col = color(random(0, 255), random(0, 255), random(0, 255));
}

function draw() {
  wind = noise(elapsedTime * 0.1);
  //background(220, 110, 55);
  //points = noise(mouseX,mouseY)*360;
  background(40, 40, 127);
  stroke(col);

  for (var i = 0; i < flowers.length; i++) {
    flowers[i].update();
  }

  image(mainCanvas, 0, 0);

  elapsedTime += deltaTime;


}

function mousePressed() {
  var f = new Flower(mouseX, mouseY, elapsedTime);
  flowers.push(f);
}

function Flower(x, y, currentTime) {
  var flowerSize = 200;


  var creationTime = currentTime;
  var objectTime = 0;
  var posX = x;
  var posY = y;

  //STEM
  var stemLgt = flowerSize * 5;
  var segments = 10;

  var segLgt = stemLgt / segments;

  //FLOWER
  var circleSize = flowerSize / 4;
  var petals = 4;
  var petalSizeFac = 1; //relative size of flower petal to circleSize.

  //GRAPHICS
  var g = createGraphics(flowerSize * 2, flowerSize * 2);
  var midPoint = createVector(g.width / 2, g.height / 2);

  var s = new Stem(posX, posY, posX, posY + stemLgt, elapsedTime);

  this.update = function () {
    objectTime = elapsedTime - creationTime;

    s.update();
    return;
    
    g.fill(255, 255, 255);

    for (var i = 0; i < petals; i++) {
      var v = fromAngle((360 / petals * i) + objectTime * 0.2, circleSize * .7);

      g.circle(midPoint.x + v.x, midPoint.y + v.y, flowerSize * petalSizeFac);  //TODO: Instead of circles we will place custom objects
    }


    g.fill(255, 255, 0);
    g.circle(midPoint.x, midPoint.y, flowerSize);

    mainCanvas.translate(-g.width / 2, -g.height / 2);
    mainCanvas.image(g, posX, posY);
    mainCanvas.reset();
  }
}

function Stem(x1, y1, x2, y2, currentTime) {
  var segments = 10;
  var creationTime = currentTime;
  var objectTime = 0;
  var pos1 = createVector(x1, y1);
  var pos2 = createVector(x2, y2);

  var dist = pos1.dist(pos2);
  var segLgt = dist / segments; //segment length

  var points = [];
  points.length = segments + 1;

  this.update = function () {
    objectTime = elapsedTime - creationTime;

    strokeWeight(20);
    color(0, 0, 0);
    this.setPoints();

    for (var i = 1; i < points.length; i++) {
      line(points[i - 1].x, points[i - 1].y, points[i].x, points[i].y);
    }
  }

  this.setPoints = function () {
    var angle = 0;
    var displacement = createVector(0, 0);

    points[0] = createVector(pos1.x, pos1.y); //set start point

    for (var i = 1; i < points.length; i++) {
      displacement = fromAngle((segLgt * i) * 0.1, segLgt);

      //CREATE POINTS
      points[i] = createVector(points[i - 1].x + displacement.x, points[i - 1].y + displacement.y);

      //BEND
      points = fromAngle((points[i - 1].y * 0.1), segLgt);
    }
  }

  this.getEnd = function () {
    return points[points.length - 1];
  }
}

function fromAngle(angle, scale = 1) {
  return createVector(cos(angle) * scale, sin(angle) * scale);
}
