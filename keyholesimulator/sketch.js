var canvas;

var elapsedTime = 0;
var speed = 0.005;

function setup() {
    //CANVAS
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0,0);
    canvas.style('z-index','-1');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(120);
  
  translate(width/2,height/2-100)
  
  for(var i=32; i>0;i--){
    translate((mouseX-width/2)/width*i,(mouseY-height/2)/height*i);
    drawkeyhole(i+elapsedTime);
  }
  
  elapsedTime+=deltaTime*speed;
}

function drawkeyhole(x){
  var xs = x%100;
  
  colorMode(HSB,100);
  stroke(100-xs, 80, 100);
  fill(100-xs, 80, 100);
  //Exterior shape, clockwise
  beginShape();
  vertex(-2000,-2000);
  vertex(2000,-2000);
  vertex(2000,2000);
  vertex(-2000,2000);
  
  // Interior shape, counter-clockwise
  beginContour();
  vertex(-30,180);//BOT L
  vertex(30,180);//BOT R
  vertex(20,30);
  vertex(33,20);
  vertex(40,0);
  vertex(33,-20);
  vertex(20,-33);
  vertex(0,-40); //TIP
  vertex(-20,-33);
  vertex(-33,-20);
  vertex(-40,0);
  vertex(-33,20);
  vertex(-20,30);
  endContour();
  endShape();
}