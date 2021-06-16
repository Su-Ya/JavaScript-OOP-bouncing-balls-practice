// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// define Ball constructor

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// define ball draw method

Ball.prototype.draw = function() {
  // 聲明我們將要在紙上畫出路徑
  ctx.beginPath();

  //球的顏色
  ctx.fillStyle = this.color;

  // arc( 圓心點 x , 圓心點 y , 圓半徑 radius , startAngle , endAngle, 逆時針 counterclockwise )
  // startAngle、endAngle 畫圓弧，從給定的 startAngle 角度開始，在 endAngle 角度結束，在給定的方向（預設順時針）
  // 2 * Math.PI = 2 π = 360 度
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  
  // 完成上面的路徑再用顏色填滿
  ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
  // 檢測球跟四個邊界是否碰撞

  // 當「圓心點 + 半徑」超出最右邊邊界，反轉位移方向
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  // 當「圓心點 + 半徑」超出最左邊邊界，反轉位移方向
  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  // 當「圓心點 + 半徑」超出最下邊邊界，反轉位移方向
  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  // 當「圓心點 + 半徑」超出最上邊邊界，反轉位移方向
  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  // 更新球的圓心點 x、y
  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection
// 檢測球體是否互相碰撞，如果碰撞就要變色
Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      /***************************************************************************
      。歐幾里德距離公式：
        設 A ( x1,y1 )、B ( x2,y2 )為平面上兩點，
        則線段 AB = ( ( x1-x2 )*( x1-x2 ) + ( y1-y2 )*( y1-y2 ) )的平方根
      。Math.sqrt 返回數的平方根，ex: Math.sqrt( (3*3) + (4*4) ) 返回 5
      ***************************************************************************/
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')';
      }
    }
  }
};

// define array to store balls and populate it

let balls = [];
// 做出 25 個球，半徑、圓心、顏色隨機產生
while(balls.length < 25) {
  // 半徑
  const size = random(10,20);
  
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    // 圓心點 x
    random(0 + size,width - size),
    // 圓心點 y
    random(0 + size,height - size),
    // x 軸移動距離
    random(-7,7),
    // y 軸移動距離
    random(-7,7),
    // 球的顏色
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
}

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);

  for(let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();