var socket;

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

let leftT;
let rightT;

let player;
var bullets = [];
var explosions = [];
let guns = [];
var zombies = [];
let blocks = [];
var gadgets = [];
let zb = 0;
let gad = 0;
let bull = 0;
let currentGun = 1;
let currentGadget = 0;
let blood = [];
let block = 0;
let zombiesKilled = 0;
let nextWave = 100;
let difficulty = 0;

let greens = [];
let rocks = [];

let step1 = [];
let step2 = [];
let step3 = [];

var mapSize = 2000;

var offset = {
	x: 0, 
	y: 0
}

var zoom = 1;
  
var players=[];

var playerData = {
	  w: false,
	  s: false,
	  a: false,
	  d: false,
	  q: false,
	  may: false,
	  spa: false,
	  click: false,
	  x: 0,
	  y: 0,
	  plus: false,
	  less: false
  }

function setup() {
	socket = io.connect('https://babs-io.herokuapp.com/');
  createCanvas(windowWidth, windowHeight);
		
  socket.emit('start', playerData);

  socket.on('heartbeat1', function(playerC) {
    players = playerC;
  });
  socket.on('heartbeat2', function(zombiesC) {
    zombies = zombiesC;
  });
  socket.on('heartbeat3', function(bulletsC) {
    bullets = bulletsC;
  });
  socket.on('heartbeat4', function(gadgetsC) {
    gadgets = gadgetsC;
  });
  socket.on('heartbeat5', function(explosionsC) {
    explosions = explosionsC;
  });
  socket.on('heartbeat6', function(bloodC) {
    blood = bloodC;
  });
  
  let shotgun =  new Gun(6,  20, 10,  2,  100, 0.4, 0.35, 10, 50,  0);
  guns.push(shotgun);
  let pistol =   new Gun(4,  8,  5,   2,  250, 0.6, 0.07, 1,  70,  0);
  guns.push(pistol);
  let smg =      new Gun(5,  20, 1,   2,  250, 0.6, 0.35, 1,  50,  0);
  guns.push(smg);
  let sniper =   new Gun(4,  34, 15,  2,  700, 0.9, 0.01, 1,  150, 2);
  guns.push(sniper);
  let bazuca =   new Gun(20, 30, 50,  7,  350, 0.3, 0.3,  1,  400, 1);
  guns.push(bazuca);
  let sterling = new Gun(5,  20, 1.7, 2,  350, 0.7, 0.2,  1,  40,  0);
  guns.push(sterling);
  let scar =     new Gun(4,  20, 5,   2,  400, 0.7, 0.1,  1,  80,  0);
  guns.push(scar);
  let grizzly =  new Gun(5,  40, 13,  3,  800, 0.8, 0.01, 1,  250, 0);
  guns.push(grizzly);
  
	for(var i = 0; i < random(10,30); i++){
		let vertexen = [];
		let col = color(random(56,150), random(150,210), random(70,170), random(0,150));
		let k = {x: random(0, mapSize), y: random(0, mapSize)};
		let radius = random(mapSize/40, mapSize/4);
		let xoff = random(0,10000);
		let increm = TWO_PI/random(6,12);
		for (var a = 0; a < TWO_PI; a += increm) {
			let offset = map(noise(xoff, 0), 0, 1, -25, 25) + random (-radius/4, radius/4);
			let r = radius + offset;
			let x = k.x + r * cos(a);
			let y = k.y + r * sin(a);
			let v = {x: x, y:y};
			vertexen.push(v);
			xoff += 0.2;
		}
		let g = {vertexes: vertexen, c: col};
		greens.push(g);
	}
	
	for(var i = 0; i < random(40,70); i++){
		let vertexen = [];
		let col = color(random(100,141), random(60,110), random(50,90));
		let k = {x: random(0, mapSize), y: random(0, mapSize)};
		let radius = random(15, 20);
		let increm = TWO_PI/random(6,10);
		let xoff = random(0,10000);
		for (var a = 0; a < TWO_PI; a += increm) {
			let offset = map(noise(xoff, 0), 0, 1, -radius*0.75, radius*0.75) + random (-radius/4, radius/4);
			let r = radius + offset;
			let x = k.x + r * cos(a);
			let y = k.y + r * sin(a);
			let v = {x: x, y:y};
			vertexen.push(v)
			xoff += 0.2;
		}
		let g = {vertexes: vertexen, c: col};
		rocks.push(g);
	}
}

function draw() {
	if(isMobile.any()){
	leftT = {
		x:width*0.2,
		y:height*0.8}
	rightT = {
		x:width*0.8,
		y:height*0.8}
	}
	
	
	for (var i = players.length - 1; i >= 0; i--) {
		var id = players[i].id;
		if (id == socket.id) {
		player = players[i];
		zoom = constrain(zoom, width/mapSize, 2.5);
		zoom = constrain(zoom, height/mapSize, 2.5);
		offset.x = player.x - width/2/zoom;
		offset.x = constrain(offset.x, 0, (mapSize - width/zoom)); 
		offset.y = player.y - height/2/zoom;
		offset.y = constrain(offset.y, 0, (mapSize - height/zoom));
		offset.x = offset.x*(-1);
		offset.y = offset.y*(-1);
		}
	}
	
  background(color(188, 170, 164));
  
  if(zombiesKilled == nextWave){
	  nextWave = 5*nextWave;
	  zombie.genTime -= 3;
	  difficulty +=10;
  }
  
  push();
  scale(zoom);
  
  details();
  pop();
  
  if (player != null){stats();}
  
  push();
  scale(zoom);
  
  for (var i = step1.length - 1; i >= 0; i--) {
		push();
		noStroke();
		fill(color(255,255,255,150));
		circle(step1[i].x + offset.x, step1[i].y + offset.y, 10);
		pop();
  }
  
  for (var i = step2.length - 1; i >= 0; i--) {
		push();
		noStroke();
		fill(color(255,255,255,100));
		circle(step2[i].x + offset.x, step2[i].y + offset.y, 8);
		pop();
  }
  for (var i = step3.length - 1; i >= 0; i--) {
		push();
		noStroke();
		fill(color(255,255,255,50));
		circle(step3[i].x + offset.x, step3[i].y + offset.y, 6);
		pop();
  }
  if(round(random(0,3)) == 0){step3 = step2;}
  if(round(random(0,3)) == 0){step2 = step1;}
  if(round(random(0,3)) == 0){step1 = players;}
	
  for (i = gadgets.length-1; i >= 0; i--) {
	  	for (var p = players.length - 1; p >= 0; p--) {
		var id = players[p].id;
		if (id == socket.id) {
		player = players[p];
		gadgetsShow(i, player);
		}
		}
		}
  
  /*for(block = blocks.length-1; block >= 0; block--) {
    blocks[block].move();
    blocks[block].show();
	blocks[block].die();
  }*/
  for (let i = 0; i < blood.length; i++) {
    bloodShow(i);
  }
  
  //player.show();
  //guns[currentGun].show();
  
  for (var i = players.length - 1; i >= 0; i--) {
		push();
    translate(players[i].x + offset.x, players[i].y + offset.y);
	playerShow(i);
    rotate(players[i].gunDir);
	translate(players[i].r, -guns[players[i].currentGun].x/2);
	push();
	if(players[i].currentGun == 0){shotgun();}
	if(players[i].currentGun == 1){pistol();}
	if(players[i].currentGun == 2){smg();}
	if(players[i].currentGun == 3){sniper();}
	if(players[i].currentGun == 4){bazuca();}
	if(players[i].currentGun == 5){sterling();}
	if(players[i].currentGun == 6){scar();}
	if(players[i].currentGun == 7){grizzly();}
	pop();
    pop();
  }
  
  for (i = bullets.length-1; i >= 0; i--) {
    bulletShow(i);
  }
  
  for (i = zombies.length-1; i >= 0; i--) {
    zombieShow(i);
  }
  
  for (let i = 0; i < explosions.length; i++) {
    explosionShow(i);
  }
  pop();
  
  inputs(playerData);
	
  socket.emit('update', playerData);
}

function inputs(playerData) {
	
	
	if(isMobile.any()){
		playerData.click = false;
		playerData.a = false;
		playerData.d = false;
		playerData.w = false;
		playerData.s = false;
		push();
		noStroke();
		fill(color(255, 100));
		circle(leftT.x, leftT.y, 175);
		circle(rightT.x, rightT.y, 175);
		for (var i = 0; i < touches.length; i++) {
			if(touches[i].x < width/2 && dist(leftT.x, leftT.y, touches[i].x, touches[i].y) < 150){
				let x = touches[i].x -leftT.x;
				let y = touches[i].y -leftT.y;
				if (x < -10) {
				playerData.a = true;
				}else{playerData.a = false;}

				if (x > 10) {
				playerData.d = true;
				}else{playerData.d = false;}

				if (y > 10) {
				playerData.s = true;
				}else{playerData.s = false;}

				if (y < -10) {
				playerData.w = true;
				}else{playerData.w = false;}
				fill(color(200, 200));
				circle(touches[i].x, touches[i].y, 50);
			}
			if(touches[i].x > width/2 && dist(rightT.x, rightT.y, touches[i].x, touches[i].y) < 150){
				let x = touches[i].x -rightT.x;
				let y = touches[i].y -rightT.y;
				let d = atan2(x, y);
				playerData.x = (300*cos(d) + player.x/zoom - offset.x);
				playerData.y = (300*sin(d) + player.y/zoom - offset.y);
				playerData.click = true;
				fill(color(255, 255));
				circle(touches[i].x, touches[i].y, 50);
			}

		}
		pop();
	}else{
		if (keyIsDown(81)) {
	      playerData.q = true;
	    }else{playerData.q = false;}

		if (keyIsDown(SHIFT)) {
			playerData.may = true;
	    }else{playerData.may = false;}

	    if (keyIsDown(LEFT_ARROW)||keyIsDown(65)) {
	      playerData.a = true;
	    }else{playerData.a = false;}

	    if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)) {
	      playerData.d = true;
	    }else{playerData.d = false;}

	    if (keyIsDown(UP_ARROW)||keyIsDown(87)) {
	      playerData.w = true;
	    }else{playerData.w = false;}

	    if (keyIsDown(DOWN_ARROW)||keyIsDown(83)) {
	      playerData.s = true;
	    }else{playerData.s = false;}

		if (keyIsDown(187)) {
	      playerData.plus = true;
	    }else{playerData.plus = false;}

		if (keyIsDown(189)) {
	      playerData.less = true;
	    }else{playerData.less = false;}

		if (keyIsDown(69)) {
	      playerData.e = true;
	    }else{playerData.e = false;}

		if (mouseIsPressed){
		  playerData.click = true;
	    }else{playerData.click = false;}

		if (keyIsDown(32)){
		  playerData.spa = true;
	    }else{playerData.spa = false;}

		playerData.x = (mouseX/zoom - offset.x);
		playerData.y = (mouseY/zoom - offset.y);
	}
  }


function playerShow(i) {
    push();
    fill(players[i].c);
	noStroke();
	push();
	rotate(players[i].gunDir);
	fill(color(255,190,190));
	ellipse(12, 0, 6, 12);
	pop();
	rotate(players[i].rot);
	fill(color(255,204,204));
    ellipse(0, 0, 24);
	fill(color(54,23,23));
    ellipse(-0.1*12, 0, 1.9*12, 1.8*12);
	fill(color(57,96,57));
    ellipse(-0.3*12, 0, 1.4*12, 1.8*12);
	pop();
  }

function zombieShow(i) {
	let c = color(zombies[i].c.r, zombies[i].c.g, zombies[i].c.b);
	c.setAlpha(zombies[i].stance);
	let gcolor = color(zombies[i].gcolor.r, zombies[i].gcolor.g, zombies[i].gcolor.b);
	gcolor.setAlpha(zombies[i].stance);
    push();
    fill(c);
    translate(zombies[i].x + offset.x, zombies[i].y + offset.y);
    rotate(zombies[i].dir);
    noStroke();
    ellipse(0, 0, 2*zombies[i].r, 2*zombies[i].r);
    fill(gcolor);
    push();
    translate(zombies[i].r,-zombies[i].r);
    rect(0, 0, 10, zombies[i].gthick);
    pop();
    push();
    translate(zombies[i].r, zombies[i].r-zombies[i].gthick)
    rect(0, 0, 10, zombies[i].gthick);
    pop();
    pop();
  }
  
  function bulletShow(i){
	push();
    translate(bullets[i].x + bullets[i].xmov + offset.x, bullets[i].y + bullets[i].ymov + offset.y);
	rotate(bullets[i].dir);
	if(bullets[i].ability == 1){
		push();
		scale(0.7);
		grenade();
		pop();
	}else if(bullets[i].ability == 2){
		push();
		scale(0.7);
		bGrenade();
		pop();
	}else{  
    
    noStroke();
    fill(bullets[i].color, 255-sqrt(sq(bullets[i].xmov) + sq(bullets[i].ymov))*255/bullets[i].range);
	rect(-1.25*bullets[i].r,-bullets[i].r, bullets[i].r*2.5, bullets[i].r*2,0,bullets[i].r,bullets[i].r,0)
    //ellipse(0, 0, bullets[i].r * 2.5, bullets[i].r *2);
	}
	pop();
  }
  
  function bloodShow(i){
    push();
    translate(blood[i].xmov + offset.x, blood[i].ymov + offset.y);
    noStroke();
    fill(color(204, 0, 0, blood[i].timeOut*3.3));
    ellipse(blood[i].x + 20*cos(blood[i].dir), blood[i].y + 20*sin(blood[i].dir), blood[i].r * 2);
    pop();
  }
  
  function  explosionShow(i){
    push();
	strokeWeight(4);
	noFill();
    stroke(color(241,35+explosions[i].r*185/explosions[i].range,15,255-explosions[i].r*255/explosions[i].range));
	ellipse(explosions[i].x + offset.x, explosions[i].y + offset.y, explosions[i].r * 2);
	stroke(color(241,35+(explosions[i].r-4)*185/explosions[i].range,15,255-(explosions[i].r-4)*255/explosions[i].range));
	ellipse(explosions[i].x + offset.x, explosions[i].y + offset.y, (explosions[i].r-4) * 2);
	stroke(color(241,35+(explosions[i].r-8)*185/explosions[i].range,15,255-(explosions[i].r-8)*255/explosions[i].range));
	ellipse(explosions[i].x + offset.x, explosions[i].y + offset.y, (explosions[i].r-8) * 2);
	stroke(color(241,35+(explosions[i].r-16)*185/explosions[i].range,15,255-(explosions[i].r-16)*255/explosions[i].range));
    ellipse(explosions[i].x + offset.x, explosions[i].y + offset.y, (explosions[i].r-16) * 2);
    pop();
  }
  
  function mouseWheel(event) {
  zoom -= event.delta*0.001;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function gadgetsShow(i, player){
    push();
	translate(gadgets[i].x + offset.x ,gadgets[i].y + offset.y);
    stroke(255);
	strokeWeight(6);
    noFill();
    ellipse(0, 0, gadgets[i].r * 2);
	push();
	rotate(gadgets[i].time);
	if(gadgets[i].gun == true){translate(-guns[gadgets[i].utility].y*0.5, -guns[gadgets[i].utility].x*0.5);}
	if(gadgets[i].utility == 0 && gadgets[i].gun == true){shotgun();}
	if(gadgets[i].utility == 1 && gadgets[i].gun == true){pistol();}
	if(gadgets[i].utility == 2 && gadgets[i].gun == true){smg();}
	if(gadgets[i].utility == 3 && gadgets[i].gun == true){sniper();}
	if(gadgets[i].utility == 4 && gadgets[i].gun == true){bazuca();}
	if(gadgets[i].utility == 5 && gadgets[i].gun == true){sterling();}
	if(gadgets[i].utility == 6 && gadgets[i].gun == true){scar();}
	if(gadgets[i].utility == 7 && gadgets[i].gun == true){grizzly();}
	if(gadgets[i].utility == 1 && gadgets[i].gun == false){grenade();}
	if(gadgets[i].utility == 2 && gadgets[i].gun == false){bGrenade();}
	if(gadgets[i].utility == 3 && gadgets[i].gun == false){healthKit();}
	if(gadgets[i].utility == 4 && gadgets[i].gun == false){bGrenade();}
	pop();
	stroke(255, 255-gadgets[i].phase*255/(gadgets[i].r + 24));
	strokeWeight(3);
	if(gadgets[i].phase > 0){ellipse(0, 0, (gadgets[i].r + gadgets[i].phase) * 2);}
	if(gadgets[i].phase > 10){ellipse(0, 0, (gadgets[i].r + gadgets[i].phase-10) * 2);}
	if(dist(player.x, player.y, gadgets[i].x, gadgets[i].y) < (gadgets[i].r + 12)*2){
		push();
		stroke(255,255);
		rect(-gadgets[i].r/2, -2.5*gadgets[i].r, gadgets[i].r, gadgets[i].r);
		textAlign(CENTER);
		strokeWeight(1);
		textSize(gadgets[i].r/2);
		text("E", 0, - 1.8*gadgets[i].r);
		pop();
  }
    pop();
  }
  
function  details(){
	for(var i = 0; i < greens.length; i++){
		push();
		noStroke();
		fill(greens[i].c);
		beginShape();
		for(var j = 0; j < greens[i].vertexes.length; j++){
			vertex(greens[i].vertexes[j].x + offset.x, greens[i].vertexes[j].y + offset.y);
		}
		endShape(CLOSE);
		pop();
	}
	
	for(var i = 0; i < rocks.length; i++){
		push();
		noStroke();
		fill(rocks[i].c);
		beginShape();
		for(var j = 0; j < rocks[i].vertexes.length; j++){
			vertex(rocks[i].vertexes[j].x + offset.x, rocks[i].vertexes[j].y + offset.y);
		}
		endShape(CLOSE);
		pop();
	}
}

/*function touchStarted() {
	let leftSide = false;
	let rightSide = false;
	for (var i = 0; i < touches.length; i++) {
		if(touches[i].x < width/2 && leftSide == false){
			leftSide = true;
			leftT.x = touches[i].x;
			leftT.y = touches[i].y;
		}
		if(touches[i].x > width/2 && rightSide == false){
			rightT = true;
			rightT.x = touches[i].x;
			rightT.y = touches[i].y;
		}
	}
}*/
