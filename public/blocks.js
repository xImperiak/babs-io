class Block {
  constructor(x, y, xx, yy, l) {
    this.x = x;
    this.y = y;
    this.xx = xx;
    this.yy = yy;
    this.life = l;
  }

  move(){
	  this.life -= 0.5*deltaTime/100;
		for (let i = 0; i < bullets.length; i++) {
			if(abs(bullets[i].x+bullets[i].xmov - this.x - this.xx/2) <= this.xx/2 && abs(bullets[i].y+bullets[i].ymov - this.y - this.yy/2) <= this.yy/2){
				this.life -= bullets[i].damage;
				if (bullets[i].ability == 3){
					bullets[i].damage -= 2*bullets[i].damage/3;
				}else{bullets[i].dead = true;}
				bullets[i].die();
				break;
			}
		}
  }

  show(){
    push();
	translate(this.x, this.y);
	push();
	noStroke();
	fill(color(88,214,141));
	translate(this.xx/2 -this.life/8, -10);
	if(this.life>0){rect(0, 0, this.life/4, 5);}
	pop();
    fill(color(102, 51, 0));
    rect(0, 0, this.xx, this.yy);
    pop();
  }
  die(){
	  if(this.life <= 0){
		blocks.splice(block, 1);
    }
  }
}