"use strict";
const canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var x = canvas.width / 2;
var y = canvas.height;
var dx = 2;
var dy = -2;
var initialballRadius = 10;
var ballRadius = initialballRadius;
var rightPressed = false;
var leftPressed = false;
var pause = false;
var gameOver = false;
var initialbrickRowCount = 1;
var brickRowCount = initialbrickRowCount;
var brickColumnCount = brickRowCount * 2;
var bricksAlive = brickRowCount * brickColumnCount;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var brickWidth = (canvas.width - (brickOffsetLeft * 2) - (brickPadding * (brickColumnCount - 1))) / brickColumnCount;
var brickHeight = 20;
var paddleHeight = 20;
var paddleWidth = brickWidth < 100 ? brickWidth : 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var cornerRadius = 20;
var initialSpeed = 5;
var speed = initialSpeed;
var initialScore = 0;
var score = initialScore;
var initialLives = 1;
var lives = initialLives;
var initialLevel = 1;
var level = initialLevel;
var levelUp = false;
var pause=false;
var c = 0;
var r = 0;
var bricks = [];

window.onload = ()=> {
	setInitialState();
 restartGame();
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("mousemove", mouseMoveHandler);

//document.addEventListener("click", mouseMoveHandler);
//document.addEventListener("mousedown", mouseMoveHandler);
document.addEventListener("mousedown", clickScreen);

/*

document.onmousedown = function () { myScript };
document.addEventListener("click", function (e) {
	clickScreen(e.clientX);
});
document.onmouseup = ()=> {
	mouseUp();
};*/

function mouseMoveHandler(e) {
	var relativeX = e.clientX;
	document
		.getElementById('right')
		.innerText = relativeX;
	if (relativeX > 0 + paddleWidth / 2 && relativeX < canvas.width - paddleWidth / 2) {
		paddleX = e.clientX - paddleWidth / 2;
	}
}

function clickScreen(e) {
	if (gameOver) {
		setgameOver();
		levelUp = false;
		restartGame();
	} else {	
		const relativeX = e.clientX;
		// document
		// 	.getElementById('right')
		// 	.innerText = relativeX;
		if (relativeX > (paddleWidth / 2) && relativeX < canvas.width - (paddleWidth / 2)) {
			paddleX = relativeX - (paddleWidth / 2);
		}
	}
}

function mouseUp() {
	rightPressed = false;
	leftPressed = false;
}

function setInitialStateBricks() {
	c = 0;
	r = 0;
	bricks = [];
	for (c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x: 0, y: 0, status: 1 };
		}
	}
}

function restartGame() {
	if (levelUp) {
		brickRowCount++;
		if (level % 5 === 0) {
			ballRadius--;
			speed--;
		}
		score += 100;
		lives++;
		level++;
		setInitialState();
	} else {
		ballRadius = initialballRadius;
		brickRowCount = initialbrickRowCount;
		speed = initialSpeed;
		score = initialScore;
		lives = initialLives;
		level = initialLevel;
		setInitialState();
	}
	draw();
}

function setInitialState() {
	x = canvas.width / 2;
	y = canvas.height - 30;
	dx = 2;
	dy = -2;
	rightPressed = false;
	leftPressed = false;
	pause = false;
	brickColumnCount = brickRowCount * 2;
	bricksAlive = brickRowCount * brickColumnCount;
	brickPadding = 5;
	brickOffsetTop = 30;
	brickOffsetLeft = 30;
	brickWidth = (canvas.width - (brickOffsetLeft * 2) - (brickPadding * (brickColumnCount - 1))) / brickColumnCount;
	brickHeight = 20;
	paddleHeight = 20;
	paddleWidth = brickWidth >= 100 ? brickWidth : 100;
	paddleX = (canvas.width - paddleWidth) / 2;
	setInitialStateBricks();
}

function drawBricks() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status === 1) {
				var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
				var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#A66803";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function setPause() {
	pause = !pause;
}

function setgameOver() {
	gameOver = !gameOver;
}

function keyDownHandler(e) {
	if (gameOver) {//alert();  
		setgameOver();
		levelUp = false;
		restartGame();
		//e.preventDefault();
	} else {
		if (e.keyCode === 39) {
			rightPressed = true;
		}
		else if (e.keyCode === 37) {
			leftPressed = true;
		}

		if (e.keyCode === 27) {
				setPause();
		 	if (!pause) {
				requestAnimationFrame(draw);
		 	 }	
		}
	}
}

function keyUpHandler(e) {
	if (e.keyCode === 39) {
		rightPressed = false;
	}
	else if (e.keyCode === 37) {
		leftPressed = false;
	}
}

function movePaddle() {
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += speed;
	}
	else if (leftPressed && paddleX > 0) {
		paddleX -= speed;
	}
}

function drawBall(color, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.lineJoin = "round";
	ctx.lineWidth = cornerRadius;
	// Change origin and dimensions to match true size (a stroke makes the shape a bit larger)
	ctx.strokeRect(paddleX + (cornerRadius / 2), canvas.height - paddleHeight + (cornerRadius / 2), paddleWidth - cornerRadius, paddleHeight - cornerRadius);
	ctx.stroke();
	ctx.strokeStyle = "#0078A3";
	ctx.fill();
	ctx.closePath();
}

function collisionDetection() {
	for (c = 0; c < brickColumnCount; c++) {
		for (r = 0; r < brickRowCount; r++) {
			var b = bricks[c][r];
			if (b.status === 1) {
				if (x + ballRadius > b.x && x + ballRadius < b.x + brickWidth &&
					y + ballRadius > b.y && y - ballRadius < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					bricksAlive--;
					if (bricksAlive === 0) {
						levelUp = true;
						restartGame();
					}
				}
			}
		}
	}
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function bounceDetection() {
	if (y + dy < (ballRadius * 1.5)) {
		dy = -dy;
	} else if (y + dy > (canvas.height - 30 ) ) {
		if (x > paddleX + 5 && x - (ballRadius * 1.5) < paddleX + paddleWidth + 5) {
			dy = -dy;
		} else {
			setPause();
			lives--;
      setTimeout(() => {	
				if (!lives) {
					clearScreen();
					drawGameover();
					setgameOver();
				} else {
					setPause();
					startLocation();			
				}
			}, 1000);
		}
	}
	if (x + dx > canvas.width - (ballRadius * 1.5) || 
		  x + dx < (ballRadius * 1.5)
		){
		dx = -dx;
	}
}

function startLocation() {
	x = canvas.width / 2;
	y = canvas.height - 30;
	dx = 2;
	dy = -2;
	paddleX = (canvas.width - paddleWidth) / 2;
	draw();
}

function drawScore() {
	//score
	ctx.font = "100% Arial";
	ctx.fillStyle = "#69DD00";
	ctx.fillText("Score: " + score, 8, 20);
	//level
	ctx.font = "100% Arial";
	ctx.fillStyle = "#00BEDD";
	ctx.fillText("Level: " + level, canvas.width / 2, 20);
	//live
	ctx.font = "16px Arial";
	ctx.fillStyle = "#FF0007";
	ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawGameover() {
	var goverX = (canvas.width / 2) - 50 + (cornerRadius / 2);
	var goverY = (canvas.height / 2) - 50 + (cornerRadius / 2);
	//------
	ctx.font = "bold 25px Arial";
	ctx.fillStyle = "#FF0007";
	ctx.fillText("Game Over", goverX - 15, goverY);
  //------
	ctx.font = "bold 18px Arial";
	ctx.fillStyle = "#3D8000";
	ctx.fillText("Score: " + score, goverX + 15, goverY + 30);
	ctx.fillText("Restart", goverX + 15, goverY + 60);
}

function draw() {
	if (!pause && !gameOver) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBricks();
		drawBall('#fff', ballRadius);
		drawPaddle();
		drawScore();
		collisionDetection();
		bounceDetection();
		movePaddle();
		x += dx;
		y += dy;
		setTimeout(draw, speed);
	}
}

function touchevent() {
	var el = document.getElementsByTagName("canvas")[0];
	el.addEventListener("touchstart", handleStart, false);
	el.addEventListener("touchend", handleEnd, false);
	el.addEventListener("touchcancel", handleCancel, false);
	el.addEventListener("touchmove", handleMove, false);
	log("initialized.");
}

var ongoingTouches = [];

function handleStart(evt) {
	evt.preventDefault();
	log("touchstart.");
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; i++) {
		log("touchstart:" + i + "...");
		ongoingTouches.push(copyTouch(touches[i]));
		var color = colorForTouch(touches[i]);
		ctx.beginPath();
		ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
		ctx.fillStyle = color;
		ctx.fill();
		log("touchstart:" + i + ".");
	}
}

function handleMove(evt) {
	evt.preventDefault();
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; i++) {
		var color = colorForTouch(touches[i]);
		var idx = ongoingTouchIndexById(touches[i].identifier);

		if (idx >= 0) {
			log("continuing touch " + idx);
			ctx.beginPath();
			log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
			ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
			log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
			ctx.lineTo(touches[i].pageX, touches[i].pageY);
			ctx.lineWidth = 4;
			ctx.strokeStyle = color;
			ctx.stroke();

			ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
			log(".");
		} else {
			log("can't figure out which touch to continue");
		}
	}
}

function handleEnd(evt) {
	evt.preventDefault();
	log("touchend");
	var el = document.getElementsByTagName("canvas")[0];
	var ctx = el.getContext("2d");
	var touches = evt.changedTouches;

	for (var i = 0; i < touches.length; i++) {
		var color = colorForTouch(touches[i]);
		var idx = ongoingTouchIndexById(touches[i].identifier);

		if (idx >= 0) {
			ctx.lineWidth = 4;
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
			ctx.lineTo(touches[i].pageX, touches[i].pageY);
			ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
			ongoingTouches.splice(idx, 1);  // remove it; we're done
		} else {
			log("can't figure out which touch to end");
		}
	}
}