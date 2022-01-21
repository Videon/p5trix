var elapsedTime = 0;
var speed = 0.0002;

var theta = 0;

var col1;
var col2;

var sizeRef;
var baseWeight = 10;

var colorStem;
var colorLeaves;

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (windowWidth < windowHeight) sizeRef = windowWidth;
  else sizeRef = windowHeight;

  colorMode(HSB, 100);
  colorStem = color(20, 49, 22);
  colorLeaves = color(36, 30, 34);

  background(0);

  randomizeColors();
}

function mousePressed() {
  randomizeColors();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (windowWidth < windowHeight) sizeRef = windowWidth;
  else sizeRef = windowHeight;
}

function randomizeColors() {
  var r = random(100);
  col1 = color(r, 100, 60);
  col2 = color((r + 50) % 100, 100, 60);
  background(color((r + 33) % 100, 100, 60));
}

function draw() {
  background(0);
  stroke(lerpColor(col1, col2, noise(elapsedTime * speed)));
  // Let's pick an angle 0 to 90 degrees based on the mouse position
  //var a = (mouseX / windowWidth) * 90;
  var a = 7;

  //var s = map(sin(elapsedTime * speed * noise(elapsedTime * speed)), -1, 1, 0.5, 12);
  var s = mouseX * 0.005;


  theta = radians(a * s);  // Convert it to radians

  translate(windowWidth / 2, windowHeight);  // Start the tree from the bottom of the screen

  stroke(colorStem);
  line(0, 0, 0, -sizeRef / 4);  // Draw a line 120 pixels
  // Move to the end of that line
  translate(0, -sizeRef / 4);
  // Start the recursive branching!
  branch(sizeRef / 4);

  elapsedTime += deltaTime;
}

function branch(h) {
  // Each branch will be 2/3rds the size of the previous one
  h *= 2 / 3;
  strokeWeight(h / 5);

  // All recursive functions must have an exit condition!!!!
  // Here, ours is when the length of the branch is 2 pixels or less
  if (h < 2) return;

  if (h * (2 / 3) < 2) { stroke(colorLeaves); strokeWeight(baseWeight*20); }
  else { stroke(colorStem) };

  push();    // Save the current state of transformation (i.e. where are we now)
  rotate(theta);   // Rotate by theta
  line(0, 0, 0, -h);  // Draw the branch
  translate(0, -h); // Move to the end of the branch
  branch(h);       // Ok, now call myself to draw two new branches!!
  pop();     // Whenever we get back here, we "pop" in order to restore the previous matrix state

  // Repeat the same thing, only branch off to the "left" this time!
  push();
  rotate(-theta);
  line(0, 0, 0, -h);
  translate(0, -h);
  branch(h);
  pop();
}



function fromAngle(angle, scale = 1) {
  return createVector(cos(angle) * scale, sin(angle) * scale);
}
