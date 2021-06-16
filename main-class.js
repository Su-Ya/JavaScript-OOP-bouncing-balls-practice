// init canvas
const canvas = document.querySelector('canvas');
const canvas_context = canvas.getContext('2d');

const CANVAS_MAX_WIDTH = window.innerWidth;
const CANVAS_MAX_HEIGHT = window.innerHeight;
canvas.width = CANVAS_MAX_WIDTH;
canvas.height = CANVAS_MAX_HEIGHT;

function setupCanvas() {
  // 設定畫布顏色
  const CANVAS_BACKGROUND_COLOR = 'rgba(0,0,0,0.25)';
  canvas_context.fillStyle = CANVAS_BACKGROUND_COLOR;

  // 根據圓心、寬、高，繪製矩形畫布
  canvas_context.fillRect(0, 0, CANVAS_MAX_WIDTH, CANVAS_MAX_HEIGHT);
}

// 產生兩個值之間的隨機整數，min <= x < max
function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

class Ball {
  constructor ({x, y, moveX, moveY, color, radius}) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.moveX = moveX;
    this.moveY = moveY;
    this.color = color;
  }

  draw() {
    // 聲明我們將要在紙上畫出路徑
    canvas_context.beginPath();
    //定義顏色
    canvas_context.fillStyle = this.color;
    // arc( 圓心點 x , 圓心點 y , 圓半徑 radius , startAngle , endAngle, 逆時針 counterclockwise )
    // 圓周弧，從給定的 startAngle 角度開始，在 endAngle 角度結束，在給定的方向（預設順時針）加到路徑
    canvas_context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    // 完成上面的路徑再用顏色填滿
    canvas_context.fill();
  }

  // 更新球的圓心點 x、y
  move() {
    // 將圓心點移動
    this.x += this.moveX;
    this.y += this.moveY;
  }

  // 球跟邊界的碰撞檢測
  changeDistanceWhenBallAndBoundaryContacting() {
    // 當「圓心點 + 半徑」超出最右邊邊界，反轉位移方向
    if((this.x + this.radius) >= CANVAS_MAX_WIDTH) {
      this.moveX = -(this.moveX);
    }
  
    // 當「圓心點 + 半徑」超出最左邊邊界，反轉位移方向
    if((this.x - this.radius) <= 0) {
      this.moveX = -(this.moveX);
    }
  
    // 當「圓心點 + 半徑」超出最下邊邊界，反轉位移方向
    if((this.y + this.radius) >= CANVAS_MAX_HEIGHT) {
      this.moveY = -(this.moveY);
    }
  
    // 當「圓心點 + 半徑」超出最上邊邊界，反轉位移方向
    if((this.y - this.radius) <= 0) {
      this.moveY = -(this.moveY);
    }
  }

  // 如果球體互相碰撞就要變色
  changeColorWhenBallsContacting(nextBall) {
    if ( this.is2BallsContacting(nextBall) ) {
      nextBall.color = this.color = `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`;
    }
  }
  // 檢測球體是否互相碰撞
  is2BallsContacting(nextBall) {
    /***************************************************************************
    。歐幾里德距離公式：
      設 A ( x1,y1 )、B ( x2,y2 )為平面上兩點，
      則線段 AB = ( ( x1-x2 )*( x1-x2 ) + ( y1-y2 )*( y1-y2 ) )的平方根
    。Math.sqrt 返回數的平方根，ex: Math.sqrt( (3*3) + (4*4) ) 返回 5
    ***************************************************************************/
    const dx = this.x - nextBall.x;
    const dy = this.y - nextBall.y;
    const  distanceOf2Balls = Math.sqrt(dx * dx + dy * dy);
    const zeroDistanceOf2Balls = this.radius + nextBall.radius;
    return distanceOf2Balls < zeroDistanceOf2Balls;
  }
}

function initBalls() {
  // 球的總數量
  const TOTAL_BALLS = 25;

  return Array(TOTAL_BALLS).fill(null).map(() => {
    // 圓半徑，從 10 ~ 20 隨機產生
    const radius = random(10,20);
    const ball_config = {
      // min: 至少一個球寬度
      // max: 圓心點遠離畫布邊緣，以避免繪製錯誤
      // 圓心點 x
      x: random(0 + radius, CANVAS_MAX_WIDTH - radius),
      // 圓心點 y
      y: random(0 + radius, CANVAS_MAX_HEIGHT - radius),
      
      // 位移範圍從 -7 ~ 7 隨機產生
      // x 軸移數字
      moveX: random(-7,7),
      // y 軸移數字
      moveY: random(-7,7),

      color: `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`,

      radius: radius
    }
    const ball = new Ball(ball_config);
    return ball;
  })
}

function loop() {

  // 設置畫布
  setupCanvas()

  const TOTAL_BALLS = balls.length;
  for(let idx = 0; idx < TOTAL_BALLS; idx++) {
    const currentBall = balls[idx];
    
    // 繪製球
    currentBall.draw();
    
    // 檢測球跟邊界是否互相碰撞，如果互相碰撞，移動距離就要改為負數
    currentBall.changeDistanceWhenBallAndBoundaryContacting();
    
    // 移動球
    currentBall.move();
    
    // 檢測第 n 個球與 n+1 之後的所有球，是否互相碰撞，如果互相碰撞就要變色
    for(let nextIdx = idx+1; nextIdx < TOTAL_BALLS; nextIdx++) {
      const nextBall = balls[nextIdx];
      currentBall.changeColorWhenBallsContacting(nextBall);
    }
  }

  // 繪製整個動畫過程
  requestAnimationFrame(loop);
}

const balls = initBalls();
loop();