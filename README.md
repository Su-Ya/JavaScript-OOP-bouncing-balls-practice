# [ JS ] 用 Canvas 練習物件導向
## demo
demo

## 目的
- 如何用 canvas 繪製物件
- 如何擷取現實世界的物件特徵
- 如何實作 OOP 物件導向

## 範例描述
>範例來源：[MDN-彈跳彩球](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Objects/Object_building_practice)

彩球會四處彈跳，而且互相碰撞時會換顏色。完成如下：
<div><img src="https://i.imgur.com/xJIERcl.gif" width="500"/></div>

## 實作前分析
我們需要準備兩個東西
1. canvas（畫布）
2. ball（彩球）

### 1. canvas（畫布）
畫布有幾點要處理
- create canvas
- 設定 canvas 寬、高
- 繪製 canvas

### 2. ball（彩球）
因為用物件導向實作彩球，所以需要建立「球」的類別。
我想了一些問題，幫助釐清彩球的特徵：
- 畫出一個彩球需要哪些資料？
- 移動一個球需要哪些資料？
- 檢測兩球是否碰撞需要哪些資料？

「彩球」的類別擁有下面這些資料
- 半徑
- 圓心點 x、y
- 顏色
- 在 canvas 上畫出球
- 在 x、y 軸上需要移動的距離，並移動圓心點
- 計算兩球的距離，並檢測是否碰撞

## 實作
MDN 版本是 `function` + `prototype`，我是先理解 MDN 版本後，再改成 `class` 版本。

理解 MDN 版本時，覺得有幾個地方處理的很漂亮：
- 畫圓的方法
	- 使用 canvas 2D API 提供的 method [CanvasRenderingContext2D.arc()](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/arc)
- 球跟畫布四個邊界的碰撞檢測
	- 當檢測到球移動後會超出畫布邊界，就讓移動距離變成負數，視覺上會呈現反彈效果
- 檢測球體是否互相碰撞
	- 用「兩球半徑相加」當作兩球零接觸的基準數字，當「計算出的兩球距離」 < 「兩球半徑相加」時，表示兩球碰撞

我在實作 `class` 版本時，有特別注重一些原則
- 命名清楚
- 每個 method 只關注一件事

做個比對，以「隨機產生 25 個球」為例
```javascript
// MDN 版本
let balls = [];
while(balls.length < 25) {
  const size = random(10,20);
  
  let ball = new Ball(
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
  );
  balls.push(ball);
}
```

```javascript
// class 版本
function initBalls() {
  const TOTAL_BALLS = 25;
  return Array(TOTAL_BALLS).fill(null).map(() => {
    const radius = random(10,20);
    const ball_config = {
      x: random(0 + radius, CANVAS_MAX_WIDTH - radius),
      y: random(0 + radius, CANVAS_MAX_HEIGHT - radius),
      moveX: random(-7,7),
      moveY: random(-7,7),
      color: `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`,
      radius: radius
    }
    const ball = new Ball(ball_config);
    return ball;
  })
}
const balls = initBalls();
```

覺得 `class` 版本還有可以精進的地方，像是初始化 canvas 我目前在全域處理

p.s MDN 版本的程式碼放在 `main-function.js` ，我有加上註解比較方便理解


## 進階
加入互動功能
- 使用者可以控制「黑洞」，當它碰到彩球後會吃掉彩球
- 顯示尚未吃掉的彩球數量

[MDN-彈跳彩球進階](https://developer.mozilla.org/zh-TW/docs/Learn/JavaScript/Objects/Adding_bouncing_balls_features)
