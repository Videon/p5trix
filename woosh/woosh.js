var startSize = 100;

function Woosh(x, y) {
    this.x = x;
    this.y = y;
    this.lifespan = 8000;
    this.elapsedTime = 0;
    this.s = true;

    this.update = function () {
        //stroke(this.lifespan);
        if (this.s) { stroke(0); } else { noStroke(); }
        this.s = !this.s;

        fill(255);

        var rad = radians(noise(this.x * noiseScale, this.y * noiseScale) * 360);
        var moveDir = p5.Vector.fromAngle(rad);

        this.x += moveDir.x;
        this.y += moveDir.y;

        circle(this.x, this.y,
            (1 - (this.lifeTimeRelative())) * startSize);

        this.elapsedTime += deltaTime;
    }

    this.isDone = function () {
        if (this.elapsedTime < this.lifespan) {
            return false;
        }
        else { return true; }
    }

    this.lifeTimeRelative = function () {
        return this.elapsedTime / this.lifespan;
    }
}