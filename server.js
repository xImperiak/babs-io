var express = require('express');

var app = express();

console.log("Server running");

function newConnection(socket){
	console.log('new connection: ' + socket.id);
}

var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
  setup();
}

app.use(express.static('public'));

var io = require('socket.io')(server);

var fs = require('fs');
//eval(fs.readFileSync('./p5.js')+'');
//eval(fs.readFileSync('./p5.sound.min.js')+'');
//eval(fs.readFileSync('./public/player.js')+'');
//eval(fs.readFileSync('./public/blood.js')+'');

function color(r,g,b){}

var timer = false;

const PI = Math.PI;
var bulletsC = [];
var explosionsC = [];
let gunsC = [];
var zombiesC = [];
let blocksC = [];
var gadgetsC = [];
var bloodC = [];

var zombie = {
  minR: 10,
  maxR: 18,
  gen: 0,
  genTime: 15,
};

var playersC = [];

var mapSize = 2000;

let nextWave = 100;
let difficulty = 0;

setInterval(heartbeat, 33);
setInterval(zombieGen, 3000);
setInterval(tick, 17);

var lastUpdate = Date.now();
var deltaTime = 50;

function tick() {
    var now = Date.now();
    deltaTime = now - lastUpdate;
    lastUpdate = now;
}

function setup(){
let shotgun =    new Gun(6,  20, 10,  2,  100, 0.4, 0.35, 10, 80,  0);
  gunsC.push(shotgun);
  let pistol =   new Gun(4,  8,  5,   2,  250, 0.6, 0.07, 1,  70,  0);
  gunsC.push(pistol);
  let smg =      new Gun(5,  20, 1,   2,  250, 0.6, 0.35, 1,  50,  0);
  gunsC.push(smg);
  let sniper =   new Gun(4,  34, 15,  2,  700, 0.9, 0.01, 1,  150, 2);
  gunsC.push(sniper);
  let bazuca =   new Gun(20, 30, 50,  7,  350, 0.3, 0.1,  1,  400, 1);
  gunsC.push(bazuca);
  let sterling = new Gun(5,  20, 1.7, 2,  350, 0.7, 0.2,  1,  40,  0);
  gunsC.push(sterling);
  let scar =     new Gun(4,  20, 5,   2,  400, 0.7, 0.1,  1,  110, 0);
  gunsC.push(scar);
  let grizzly =  new Gun(5,  40, 13,  3,  800, 0.8, 0.01, 1,  250, 0);
  gunsC.push(grizzly);
}

function heartbeat() {
  io.sockets.emit('heartbeat1', playersC);
  io.sockets.emit('heartbeat2', zombiesC);
  io.sockets.emit('heartbeat3', bulletsC);
  io.sockets.emit('heartbeat4', gadgetsC);
  io.sockets.emit('heartbeat5', explosionsC);
  io.sockets.emit('heartbeat6', bloodC);
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on(
  'connection',
  // We are given a websocket object in our function
  function(socket) {
    console.log('We have a new client: ' + socket.id);

    socket.on('start', function(playerData) {
	  let player = new Player(random(0, mapSize), random(0, mapSize), 12, socket.id);
      playersC.push(player);
	  if(timer = true){clearInterval(gadgetGen)}
	  if(playersC.length == 1){setInterval(gadgetGen, 60000)}else{
	  setInterval(gadgetGen, 60000/(playersC.length-1))}
	  timer = true;
    });

    socket.on('update', function(playerData) {
      for (var i = 0; i < playersC.length; i++) {
        if (socket.id == playersC[i].id) {
          playersC[i].move(playerData);
		  if (playerData.spa == true){useGadget(i, playerData)}
		  playersC[i].die(playerData);
		  move(playerData, socket);
        }
      }
    });
	
	

    socket.on('disconnect', function() {
      console.log('Client has disconnected');
	  for (var i = 0; i < playersC.length; i++) {
        if (socket.id == playersC[i].id) {
          playersC.splice(i,1);
        }
      }
	  if(playersC.length == 0){
		  zombiesC.length = 0;
		  gadgetsC.length = 0;
		  clearInterval(gadgetGen);
		  timer = false;
		  }
    });
  }
);

function move(playerData, socket){
	for (var i = 0; i < zombiesC.length; i++){
		zombiesC[i].move();
		zombiesC[i].die(i);
	}
	for (var i = 0; i < bulletsC.length; i++){
	bulletsC[i].move();
	bulletsC[i].die(i);
	}
	for (var i = 0; i < explosionsC.length; i++){
	explosionsC[i].show();
	explosionsC[i].die();
	}
	for (var i = 0; i < gadgetsC.length; i++){
		for (var p = 0; p < playersC.length; p++) {
        if (socket.id == playersC[p].id) {
			let player = playersC[p];
			gadgetsC[i].move(player);
			gadgetsC[i].die(i, player, playerData);
			playersC[p] = player;
		}
		}
	}
	for (var i = 0; i < bloodC.length; i++){
	bloodC[i].move();
	bloodC[i].die();
	}
}

class Gun {
  constructor(x, y, r, b, d, s, o, n, damage, a) {
	this.x = x;
	this.y = y;
    this.reloadTime = r;
    this.bWidth = b;
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

class Player {
  constructor(x, y, r, id) {
    this.x = x;
    this.y = y;
    this.r = r;
	this.life = 1000;
    this.c = 150;
	this.currentGun = 1;
	this.currentGadget = 0;
	this.walkVel = 0.1;
	this.runVel = 0.2;
	this.crouchVel = 0.02;
    this.v = 0.1;
	this.stamina = 100;
	this.moving = false;
	this.alive = true;
	this.rot = 0;
	this.gunDir = 0;
	this.reload = 0;
	this.id = id;
	
  }

  move(playerData) {
	
	  if(this.alive == true){
		  this.reload -= deltaTime/100;
	
	if (this.v == this.crouchVel) {
      gunsC[this.currentGun].realOffset = 0.5*gunsC[this.currentGun].offset;
    }else if (this.v == this.runVel) {
      gunsC[this.currentGun].realOffset = 1.5*gunsC[this.currentGun].offset;
    }else {gunsC[this.currentGun].realOffset = gunsC[this.currentGun].offset}
	
    if (playerData.click == true && this.reload <= 0) {
		if (gunsC[this.currentGun].ability == 0){
		  for(let i = 0; i < gunsC[this.currentGun].bnumber; i++){
		this.gunDir += random(-gunsC[this.currentGun].realOffset,gunsC[this.currentGun].realOffset);
		let b = new Bullet(this.x + cos(this.gunDir)*(this.r+gunsC[this.currentGun].y), this.y + sin(this.gunDir)*(this.r+gunsC[this.currentGun].y), gunsC[this.currentGun].bWidth, gunsC[this.currentGun].range, gunsC[this.currentGun].bspeed, this.gunDir, gunsC[this.currentGun].damage, 50, 0);
		bulletsC.push(b);
		  }
		}
		if (gunsC[this.currentGun].ability == 1){
		  for(let i = 0; i < gunsC[this.currentGun].bnumber; i++){
		this.gunDir += random(-gunsC[this.currentGun].realOffset,gunsC[this.currentGun].realOffset);
		let b = new Bullet(this.x + cos(this.gunDir)*(this.r+gunsC[this.currentGun].y), this.y + sin(this.gunDir)*(this.r+gunsC[this.currentGun].y), gunsC[this.currentGun].bWidth, gunsC[this.currentGun].range, gunsC[this.currentGun].bspeed, this.gunDir, gunsC[this.currentGun].damage, 50, 4);
		bulletsC.push(b);
		  }
	  }
	  if (gunsC[this.currentGun].ability == 2){
		  for(let i = 0; i < gunsC[this.currentGun].bnumber; i++){
		this.gunDir += random(-gunsC[this.currentGun].realOffset,gunsC[this.currentGun].realOffset);
		let b = new Bullet(this.x + cos(this.gunDir)*(this.r+gunsC[this.currentGun].y), this.y + sin(this.gunDir)*(this.r+gunsC[this.currentGun].y), gunsC[this.currentGun].bWidth, gunsC[this.currentGun].range, gunsC[this.currentGun].bspeed, this.gunDir, gunsC[this.currentGun].damage, 50, 3);
		bulletsC.push(b);
		  }
		}
      this.reload = gunsC[this.currentGun].reloadTime;
	  }
	  
		  this.rot = Math.atan2(playerData.y - this.y, playerData.x - this.x);
		  if(this.rot-this.gunDir > PI){
			this.gunDir += 2*PI;
		  }
		  if(this.gunDir-this.rot > PI){
			this.gunDir -= 2*PI;
		  }
		  if(this.gunDir < this.rot){
			this.gunDir += deltaTime/1000*gunsC[this.currentGun].vRot*abs(this.rot-this.gunDir);
		  }
		  if(this.gunDir > this.rot){
			this.gunDir -= deltaTime/1000*gunsC[this.currentGun].vRot*abs(this.rot-this.gunDir);
		  }
	if (playerData.q == true) {
      this.v = this.crouchVel;
    }else if (playerData.may == true && this.stamina > 0 && this.moving == true) {
      this.v = this.runVel;

    }else {
		this.v = this.walkVel;
	}
	if(this.v == this.runVel){
		this.stamina -= 5*deltaTime/100;
	}else if(this.stamina < 100 && this.moving == true && this.stamina > 10){
		this.stamina += 0.5*deltaTime/100;
	}else if(this.stamina < 100 && this.moving == false){
		this.stamina += deltaTime/100;
	}
	
	this.moving = false;
    if (playerData.a == true) {
      this.x -= this.v*deltaTime;
	  this.moving = true;
    }

    if (playerData.d == true) {
      this.x += this.v*deltaTime;
	  this.moving = true;
    }

    if (playerData.w == true) {
      this.y -= this.v*deltaTime;
	  this.moving = true;
    }

    if (playerData.s == true) {
      this.y += this.v*deltaTime;
	  this.moving = true;
    }
	
	/*if (playerData.plus == true && this.reload <= 0 && this.currentGun < gunsC.length -1) {
		this.currentGun ++;
		this.reload =5;
    }
	
	if (playerData.less == true && this.reload <= 0 && this.currentGun > 0) {
		this.currentGun --;
		this.reload = 5;
    }*/
	
	if(this.life > 1000){this.life = 1000;}
	if(this.x > mapSize || this.y > mapSize || this.x < 0 || this.y < 0){this.life -= deltaTime/10;}
	}
  }

  die(){
	  if(this.alive == true){
		  
		for (let b = 0; b < bulletsC.length; b++) {
			if(dist(bulletsC[b].x+bulletsC[b].xmov, bulletsC[b].y+bulletsC[b].ymov, this.x, this.y) <= this.r+bulletsC[b].r){
				this.life -= bulletsC[b].damage;
				for(let i = 0; i < Math.round(random(1,3)); i++){
					let d = new Blood(this.x, this.y, random(1,6), random(-10,30), random(-1*PI, PI));
					bloodC.push(d);
				}
				if (bulletsC[b].ability == 3){
					bulletsC[b].damage -= 2*bulletsC[b].damage/3;
				}else{bulletsC[b].dead = true;}
				bulletsC[b].die();
				break;
			}
		}
		
		if(this.life <= 0){
			for(let i = 0; i < Math.round(random(40,50)); i++){
					let b = new Blood(this.x, this.y, random(1,6), random(-10,30), random(-1*PI, PI));
					bloodC.push(b);
				}
				this.alive = false;
			}
	  }
			
	}
}

class Bullet {
  constructor(x, y, r, l, s, d, damage, c, a) {
    this.x = x;
    this.y = y;
    this.xmov = 0;
    this.ymov = 0;
    this.r = r;
    this.speed = s;
    this.dir = d;
	this.color = c;
    this.range = l;
	this.damage = damage;
	this.ability = a;
	this.dead = false;
  }

  move() {
    this.xmov = cos(this.dir)*this.speed*deltaTime + this.xmov;
    this.ymov = sin(this.dir)*this.speed*deltaTime + this.ymov;
    
  }

  die(i){
	  if(sqrt(sq(this.xmov) + sq(this.ymov)) >= this.range || this.dead == true){
		  if(this.ability == 1 || this.ability == 4){
				let c = new Explosion(this.x + this.xmov, this.y + this.ymov, random(40,100), random(20,30));
				explosionsC.push(c)
		  }
		  if(this.ability == 2){
				let d = 0
				for(let i = 0; i < 30; i++){
					d += PI/15;
					let b = new Bullet(this.x + this.xmov, this.y + this.ymov, 2, 100, 0.2, d, 40, 50, 0);
					bulletsC.push(b);
				}
		  }
		bulletsC.splice(i,1);
    }
  }
}

class Gadget {
  constructor(x, y, u, g) {
    this.x = x;
    this.y = y;
    this.utility = u;
	this.gun = g;
	this.phase = 0;
	this.time = 0;
	if(this.gun == true){
		this.r = gunsC[this.utility].y + 10;
	}
	if(this.gun == false){this.r = 30;}
  }

  move(player) {
    if (dist(player.x, player.y, this.x, this.y) < (this.r + player.r)*2 && this.phase < this.r + 2* player.r){
		this.phase += deltaTime/25;
	}else{this.phase = 0;}
	this.time += deltaTime/1000;
    
  }

  die(i, player, playerData){
	  if(dist(player.x, player.y, this.x, this.y) < (this.r + player.r)*2 && playerData.e == true){
		  if(this.gun == true){player.currentGun = this.utility}
		  if(this.gun == false){player.currentGadget = this.utility}
		  gadgetsC.splice(i,1);
	  }
	  if(this.time > 90){
		  console.log(deltaTime);
		  console.log(this.time);
		  gadgetsC.splice(i,1);
	  }
    }
  }
  
  function useGadget(i, playerData){
	//let b = new Block(player.x, player.y, random(20,30), random(20,30), random(100,140));
	//blocks.push(b);
	if (playersC[i].currentGadget == 1){
		grenadeUse(i, playerData);
	}
	if (playersC[i].currentGadget == 2){
		bGrenadeUse(i, playerData);
	}
	if (playersC[i].currentGadget == 3){
		healthKitUse(i);
	}
	playersC[i].currentGadget = 0;
}

function grenadeUse(i, playerData){
	let d = playersC[i].rot;
	let b = new Bullet(playersC[i].x + cos(d)*(playersC[i].r+20), playersC[i].y + sin(d)*(playersC[i].r+20), 7, constrain(dist(playersC[i].x, playersC[i].y, playerData.x, playerData.y),playersC[i].r+10,300), 0.3, d, 0, 0, 1);
	bulletsC.push(b);
}

function bGrenadeUse(i, playerData){
	let d = playersC[i].rot;
	let b = new Bullet(playersC[i].x + cos(d)*(playersC[i].r+20), playersC[i].y + sin(d)*(playersC[i].r+20), 5, constrain(dist(playersC[i].x, playersC[i].y, playerData.x, playerData.y),playersC[i].r+10,300), 0.3, d, 0, 0, 2);
	bulletsC.push(b);
}

function healthKitUse(i){
	playersC[i].life += random(250,400);
}
  
function  gadgetGen(){
		if (1 == Math.round(random(0,1))){
			let g = new Gadget(random(0, mapSize), random(0, mapSize), Math.round(random(0,6)), true);
			gadgetsC.push(g);
		}else{
		let g = new Gadget(random(0, mapSize), random(0, mapSize), Math.round(random(1,3)), false);
		gadgetsC.push(g);
		}
}

class Blood {
  constructor(x, y, r, l, d) {
    this.x = x;
    this.y = y;
    this.xmov = 0;
    this.ymov = 0;
    this.r = r;
    this.speed = 0.2;
    this.dir = d;
    this.range = l;
	this.timeOut = random(20,40);
  }

  move(){
	  this.timeOut -= deltaTime/100;
	  while(sqrt(sq(this.xmov) + sq(this.ymov)) < this.range){
		this.xmov = cos(this.dir)*this.speed*deltaTime + this.xmov;
		this.ymov = sin(this.dir)*this.speed*deltaTime + this.ymov;
	  }
    
  }
  
  die(){
	  if(this.timeOut <= 0){
		bloodC.shift();
    }
  }
}

class Zombie {
  constructor(x, y, r, a, c) {
    this.x = x;
    this.y = y;
    this.r = r;
	this.force = r*10;
	this.life = r*10;
    this.ability = a;
    this.gthick = 5;
    this.gcolor = {
		r: 20,
		g: 90,
		b: 50
	};
    this.c = c;
    this.v = 0.01;
    this.dir = 0;
	this.reloadTime = 25;
	this.reload = 0;
	this.offset = 0;
	this.vRot = 1;
	if (this.ability == 1 || this.ability == 4){this.v = this.v * 15; this.vRot = this.vRot * 15;}
	if (this.ability == 5){this.force = this.force * 5}
	this.stance = 255;
	this.killed = false;
	this.objective = 0;
	this.player = 0;
  }

  move() {
	  if (this.killed == false){
	this.reload -= deltaTime/100;
	
		let nearest = 0;
		let nearestDist = 2000;
	for (var i = 0; i < playersC.length; i++) {
		let dst = dist(playersC[i].x, playersC[i].y, this.x, this.y);
		if(dst < nearestDist){
			nearest = i;
			nearestDist = dst;
		}
		let player = playersC[nearest];
		this.player = nearest;
		this.objective = Math.atan2(player.y - this.y, player.x - this.x);
		
	}
		  if(this.objective-this.dir > PI){
			this.dir += 2*PI;
		  }
		  if(this.dir-this.objective > PI){
			this.dir -= 2*PI;
		  }
		  if(this.dir < this.objective){
			this.dir += deltaTime/1000*this.vRot*abs(this.objective-this.dir);
		  }
		  if(this.dir > this.objective){
			this.dir -= deltaTime/1000*this.vRot*abs(this.objective-this.dir);
		  }
	if(dist(this.x, this.y, playersC[this.player].x, playersC[this.player].y) > (this.r + playersC[this.player].r)){
		this.x += cos(this.dir)*this.v*deltaTime;
		this.y += sin(this.dir)*this.v*deltaTime;
	}
	
	for (var i = 0; i < playersC.length; i++) {
		let player = playersC[i];
		if(dist(this.x, this.y, player.x, player.y) <= (this.r + player.r) && this.reload <= 0){
		if(this.ability == 4){this.life = 0}else{
		player.life -= this.force;
		this.reload = this.reloadTime;
		for(let i = 0; i < Math.round(random(4,7)); i++){
					let b = new Blood(player.x, player.y, random(1,6), random(-10,30), random(-PI, PI));
					bloodC.push(b);
				}
		}
	}
	}
    
	  }
	  }
  
	die(i){
		if (this.killed == false){
		for (let i = 0; i < bulletsC.length; i++) {
			if(dist(bulletsC[i].x+bulletsC[i].xmov, bulletsC[i].y+bulletsC[i].ymov, this.x, this.y) <= this.r+bulletsC[i].r){
				this.life -= bulletsC[i].damage;
				for(let i = 0; i < Math.round(random(1,3)); i++){
					let b = new Blood(this.x, this.y, random(1,6), random(-10,30), random(-PI, PI));
					bloodC.push(b);
				}
				if (bulletsC[i].ability == 3){
					bulletsC[i].damage -= 2*bulletsC[i].damage/3;
				}else{bulletsC[i].dead = true;}
				bulletsC[i].die();
				break;
			}
		}
		if(this.life <= 0){
			for(let i = 0; i < Math.round(random(3,7)); i++){
					let b = new Blood(this.x, this.y, random(1,6), random(0,30), random(-PI, PI));
					bloodC.push(b);
				}
			if(this.ability == 2 || this.ability == 4){
				let c = new Explosion(this.x, this.y, random(50,100), random(20,30));
				explosionsC.push(c);
			}
			if(this.ability == 3){
				//player.life += random(5,25);
			}
			
			this.killed = true;
		}
		}
		if (this.killed == true){
			this.stance -= deltaTime/4;
		}
		if(this.stance <= 0){
			zombiesC.splice(i,1);
			}
	}

}

function zombieGen(){
	if (playersC.length > 0){
	  let r = random(difficulty,100);
	  if (r < 78){
		  let c = {
		r: Math.round(random(0, 70)),
		g: Math.round(random(90, 190)),
		b: Math.round(random(70, 120))
	};
	if(Math.round(random(1,2))==1){
		let z = new Zombie(random(0, mapSize), mapSize*Math.round(random(0, 1)), random(zombie.minR, zombie.maxR), 0, c);
		zombiesC.push(z);
	}else{
		let z = new Zombie(mapSize*Math.round(random(0, 1)), random(0, mapSize), random(zombie.minR, zombie.maxR), 0, c);
		zombiesC.push(z);
	}
	  }
	  if (r >= 78 && r < 83){
		  let c = {
		r: Math.round(random(230, 255)),
		g: Math.round(random(180, 220)),
		b: Math.round(random(50, 80))
	};
	if(Math.round(random(1,2))==1){
		let z = new Zombie(random(0, mapSize), mapSize*Math.round(random(0, 1)), random(zombie.minR*0.8, zombie.maxR*0.8), 5, c);
		zombiesC.push(z);
	}else{
		let z = new Zombie(mapSize*Math.round(random(0, 1)), random(0, mapSize), random(zombie.minR*0.8, zombie.maxR*0.8), 5, c);
		zombiesC.push(z);
	}
	  }
	if (r >= 83 && r < 88){
	let c = {
		r: Math.round(random(0, 80)),
		g: Math.round(random(140, 200)),
		b: Math.round(random(210, 255))
	};
	if(Math.round(random(1,2))==1){
		let z = new Zombie(random(0, mapSize), mapSize*Math.round(random(0, 1)), random(zombie.minR*0.8, zombie.maxR*0.8), 1, c);
		zombiesC.push(z);
	}else{
		let z = new Zombie(mapSize*Math.round(random(0, 1)), random(0, mapSize), random(zombie.minR*0.8, zombie.maxR*0.8), 1, c);
		zombiesC.push(z);
	}
	  }
	if (r >= 88 && r < 92){
	let c = {
		r: Math.round(random(190, 255)),
		g: Math.round(random(40, 90)),
		b: Math.round(random(0, 50))
	};
	if(Math.round(random(1,2))==1){
		let z = new Zombie(random(0, mapSize), mapSize*Math.round(random(0, 1)), random(zombie.minR, zombie.maxR), 2, c);
		zombiesC.push(z);
	}else{
		let z = new Zombie(mapSize*Math.round(random(0, 1)), random(0, mapSize), random(zombie.minR, zombie.maxR), 2, c);
		zombiesC.push(z);
	}
	  }
	if (r >= 92 && r < 98.5){
	let c = {
		r: Math.round(random(0, 30)),
		g: Math.round(random(0, 70)),
		b: Math.round(random(0, 30))
	};
	
	if(Math.round(random(1,2))==1){
		let z = new Zombie(random(0, mapSize), mapSize*Math.round(random(0, 1)), random(zombie.minR*2.2, zombie.maxR*2), 0, c);
		zombiesC.push(z);
	}else{
		let z = new Zombie(mapSize*Math.round(random(0, 1)), random(0, mapSize), random(zombie.minR*2.2, zombie.maxR*2), 0, c);
		zombiesC.push(z);
	}
	  }
	if (r >= 98.5 && r < 99.5){
	let c = {
		r:Math.round(random(230, 255)),
		g:Math.round(random(230, 255)),
		b:Math.round(random(230, 255))
	};
	if(Math.round(random(1,2))==1){
		let z = new Zombie(random(0, mapSize), mapSize*Math.round(random(0, 1)), random(zombie.minR, zombie.maxR), 3, c);
		zombiesC.push(z);
	}else{
		let z = new Zombie(mapSize*Math.round(random(0, 1)), random(0, mapSize), random(zombie.minR, zombie.maxR), 3, c);
		zombiesC.push(z);
	}
	  }
	if (r >= 99.5){
	let c = {
		r: Math.round(random(140, 190)),
		g: 15,
		b: Math.round(random(190, 230))
	};
	if(Math.round(random(1,2))==1){
		let z = new Zombie(random(0, mapSize), mapSize*Math.round(random(0, 1)), random(zombie.minR*0.8, zombie.maxR*0.8), 4, c);
		zombiesC.push(z);
	}else{
		let z = new Zombie(mapSize*Math.round(random(0, 1)), random(0, mapSize), random(zombie.minR*0.8, zombie.maxR*0.8), 4, c);
		zombiesC.push(z);
	}
	  }
	
}
}

class Explosion {
  constructor(x, y, l, damage) {
    this.x = x;
    this.y = y;
    this.r = 5;
    this.range = l;
	this.damage = damage*10;
	this.hit = [];
  }

  show(){
	this.r += 3*deltaTime/100;
	for (let i = 0; i < playersC.length; i++) {
		let player = playersC[i];
	if(dist(this.x, this.y, player.x, player.y) <= (this.r + player.r)){
		let hit = false;
		if(this.hit.indexOf(player.id)>=0){hit = true}
		if(hit == false){
				player.life -= this.damage;
				for(let i = 0; i < round(random(4,7)); i++){
					let b = new Blood(player.x, player.y, random(1,6), random(-10,30), random(-PI, PI));
					bloodC.push(b);
			this.hit.push(player.id);
			}
		}
		
	}
	}
    for (let i = 0; i < zombiesC.length; i++) {
			if(dist(zombiesC[i].x, zombiesC[i].y, this.x, this.y) <= this.r+zombiesC[i].r){
				zombiesC[i].life -= this.damage;
				for(let c = 0; c < round(random(1,3)); c++){
					let b = new Blood(zombiesC[i].x, zombiesC[i].y, random(1,6), random(-10,30), random(-PI, PI));
					bloodC.push(b);
				}
				break;
			}
		}
  }
  die(){
	  if(this.r >= this.range){
		explosionsC.shift();
    }
  }
}

function round(x){
    return Math.round(x);
}

function random(min,max){
    return Math.random()*(max-min)+min;
}

function dist(x1, y1, x2, y2){
	return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
}

function abs(x){
	return Math.abs(x);
}

function sqrt(x){
	return Math.sqrt(x);
}

function sq(x){
	return (x*x);
}

function cos(x){
	return Math.cos(x);
}

function sin(x){
	return Math.sin(x);
}

function constrain(num, min, max){
  const MIN = min;
  const MAX = max;
  const parsed = parseInt(num)
  return Math.min(Math.max(parsed, MIN), MAX)
}
