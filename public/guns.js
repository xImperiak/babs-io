class Gun {
  constructor(x, y, r, b, d, s, o, n, damage, a) {
	this.x = x;
	this.y = y;
    this.reloadTime = r;
    this.bWidth = b;
    this.reload = r;
    this.range = d;
    this.bspeed = s;
	this.offset = o;
	this.realOffset = this.offset;
	this.bnumber = n;
	this.damage = damage;
	this.ability = a;
	this.vRot = 7;
  }
}

function shotgun(){
	push();
	noStroke();
	fill(120,66,18);
    rect(0, 0, guns[0].y/5, guns[0].x);
	fill(166,172,175);
	rect(guns[0].y/5, 0, guns[0].y/10, guns[0].x);
	fill(110,44,0);
	rect(2.2*guns[0].y/5, -guns[0].x*0.2, 1.8*guns[0].y/5, guns[0].x*1.4);
	fill(23,32,42);
	rect(3*guns[0].y/10, 0, 3*guns[0].y/5, guns[0].x);
	pop();
}

function pistol(){
	push();
	noStroke();
	fill(144,148,151);
    rect(0, 0, guns[1].y, guns[1].x);
	fill(0,0,0);
    rect(guns[1].y*0.2, guns[1].x*0.2, guns[1].y*0.15, guns[1].x*0.6);
	rect(guns[1].y*0.8, guns[1].x*0.3, guns[1].y*0.2, guns[1].x*0.4);
	pop();
}

function smg(){
	push();
	noStroke();
	fill(147,81,22);
    rect(0, 0, guns[2].y*0.2, guns[2].x);
	fill(23,32,42);
    rect(guns[2].y*0.2, 0, guns[2].y*0.4, guns[2].x);
	rect(guns[2].y*0.3, -guns[2].x*0.75, guns[2].y*0.15, guns[2].x*2.5);
	rect(guns[2].y*0.6, guns[2].x*0.15, guns[2].y*0.4, guns[2].x*0.7);
	rect(guns[2].y*0.8, 0, guns[2].y*0.1, guns[2].x);
	pop();
}

function sniper(){
	push();
	noStroke();
	fill(147,81,22);
    rect(0, 0, guns[3].y*0.6, guns[3].x);
	rect(guns[3].y*0.6, guns[3].x*0.2, guns[3].y*0.3, guns[3].x*0.6);
	fill(23,32,42);
    rect(guns[3].y*0.9, guns[3].x*0.1, guns[3].y*0.1, guns[3].x*0.8);
	rect(guns[3].y*0.35, guns[3].x*0.1, guns[3].y*0.1, guns[3].x*0.8);
	rect(guns[3].y*0.2, guns[3].x*0.3, guns[3].y*0.15, guns[3].x*0.4);
	rect(guns[3].y*0.15, guns[3].x*0.2, guns[3].y*0.05, guns[3].x*0.6);
	rect(0, 0, guns[3].y*0.05, guns[3].x);
	pop();
}

function bazuca(){
	push();
	noStroke();
	fill(35,155,86);
    rect(guns[4].y*0.1, guns[4].x*0.1, guns[4].y*0.8, guns[4].x*0.8);
	fill(25,111,61);
    rect(0, 0, guns[4].y*0.1, guns[4].x);
	rect(guns[4].y*0.9, -guns[4].x*0.1, guns[4].y*0.1, guns[4].x*1.2);
	rect(guns[4].y*0.4, guns[4].x*0.5, guns[4].y*0.3, guns[4].x*0.3);
	fill(244,208,63);
    rect(guns[4].y*0.8, guns[4].x*0.1, guns[4].y*0.05, guns[4].x*0.8);
	fill(171,235,198);
    rect(guns[4].y*0.2, guns[4].x*0.1, guns[4].y*0.05, guns[4].x*0.8);
    rect(guns[4].y*0.3, guns[4].x*0.1, guns[4].y*0.05, guns[4].x*0.8);
	pop();
}

function sterling(){
	push();
	noStroke();
	fill(23,32,42);
    rect(0, 0, guns[5].y*0.2, guns[5].x);
	rect(guns[5].y*0.3, -guns[5].x*0.25, guns[5].y*0.15, guns[5].x*2.8);
	fill(77,86,86);
    rect(guns[5].y*0.2, 0, guns[5].y*0.4, guns[5].x);
	rect(guns[5].y*0.6, guns[5].x*0.15, guns[5].y*0.4, guns[5].x*0.7);
	fill(23,32,42);
	rect(guns[5].y*0.8, 0, guns[5].y*0.1, guns[5].x);
	pop();
}

function scar(){
	push();
	noStroke();
	fill(229,152,102);
    rect(guns[6].y*0.1, 0, guns[6].y*0.7, guns[6].x);
	fill(23,32,42);
	rect(0, 0, guns[6].y*0.1, guns[6].x);
	rect(guns[6].y*0.8, guns[6].x*0.2, guns[6].y*0.2, guns[6].x*0.6);
	rect(guns[6].y*0.95, guns[6].x*0.1, guns[6].y*0.05, guns[6].x*0.8);
	rect(guns[6].y*0.2, guns[6].x*0.2, guns[6].y*0.05, guns[6].x*0.6);
	rect(guns[6].y*0.7, guns[6].x*0.2, guns[6].y*0.05, guns[6].x*0.6);
	pop();
}

function grizzly(){
	push();
	noStroke();
	fill(208,211,212);
    rect(0, 0, guns[7].y*0.5, guns[7].x);
	rect(guns[7].y*0.5, guns[7].x*0.3, guns[7].y*0.4, guns[7].x*0.4);
	fill(23,32,42);
    rect(guns[7].y*0.9, guns[7].x*0.1, guns[7].y*0.1, guns[7].x);
	rect(guns[7].y*0.35, guns[7].x*0.1, guns[7].y*0.1, guns[7].x*0.8);
	rect(guns[7].y*0.2, guns[7].x*0.3, guns[7].y*0.15, guns[7].x*0.4);
	rect(guns[7].y*0.15, guns[7].x*0.2, guns[7].y*0.05, guns[7].x*0.6);
	rect(guns[7].y*0.3, guns[7].x, guns[7].y*0.2, guns[7].x*0.4);
	rect(guns[7].y*0.3, -0.4*guns[7].x, guns[7].y*0.2, guns[7].x*0.4);
	rect(0, 0, guns[7].y*0.05, guns[7].x);
	pop();
}