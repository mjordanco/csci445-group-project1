//INITIALIZE GAME VARIABLES------------------------------------------------------
//-------------------------------------------------------------------------------

var canvas = document.getElementById("myCanvas");
var frame = 0;
var mouseX = 0;
var mouseY = 0;

var brightness = 0;
var flashTime = 0;

var points = 0;
var hit_last_target = true;
var hit_in_a_row = 0;
var miss_in_a_row = 0;

var playGame = true;
var lives = 3;

var gameIntervalID = -1;

var enemy = new Enemy();
var radiusChange = 0;
var minRadius = 20;
var maxRadius = 100;
var xChange = 0;
var yChange = 0;

window.setInterval(drawScreen, 32);
window.setInterval(gameLogic, 32);

//FUNCTIONS-------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------

function handleMouseMove(event) {
	canvas = document.getElementById("myCanvas");

	var top = window.pageYOffset || document.documentElement.scrollTop
	var left = window.pageXOffset || document.documentElement.scrollLeft

	mouseX=event.clientX-10-canvas.offsetLeft+left;
	mouseY=event.clientY-10-canvas.offsetTop+top;
}

//Main game logic
function handleMouseClick() {
	if (playGame == true) {
		flashTime=10;
		var gunsound = document.getElementById("gunshot");
		gunsound.currentTime=0;
		gunsound.play();

		//Determine mouse click location in relation to target location
		var xDif = enemy.xPosition - mouseX;
		var yDif = enemy.yPosition - mouseY;
		var dist = Math.sqrt(xDif * xDif + yDif * yDif);
		document.getElementById("myTextArea").value = dist;
	
		//If the mouse click is within the radius of the target
		if (dist < enemy.radius) {
			points++; 
			hit_in_a_row++;
			miss_in_a_row = 0;
			hit_last_target = true;
		
			//Generate a new target with random radius and location
			enemy = new Enemy();
			minRadius = enemy.radius;
			maxRadius = enemy.radius * 1.25;
		
			//Makes size of radius of a target oscillate back and forth to give 'pulsing' effect
			var rand = Math.random();
			if (rand > .5) {
				radiusChange = 1;
			} else {
				radiusChange = -1;
			}
		
			//Causes the target to move around the screen
			//The larger the change, the faster the target moves
			if (points <= 10) {
				xChange = Math.round(Math.random() * 10);
				yChange = Math.round(Math.random() * 10);
			} else if (points > 10 && points <= 20) { 
				xChange = Math.round(Math.random() * 10) + 5;
				yChange = Math.round(Math.random() * 10) + 5;
			} else if (points > 20 && points <= 30) { 
				xChange = Math.round(Math.random() * 10) + 7;
				yChange = Math.round(Math.random() * 10) + 7;
			} else if (points > 30 && points <= 40) { 
				xChange = Math.round(Math.random() * 10) + 9;
				yChange = Math.round(Math.random() * 10) + 9;
			} else if (points > 40 && points <= 50) {
				xChange = Math.round(Math.random() * 10) + 10;
				yChange = Math.round(Math.random() * 10) + 10;
			} else if (points > 50 && points <= 60) { 
				xChange = Math.round(Math.random() * 10) + 11;
				yChange = Math.round(Math.random() * 10) + 11;
			} else if (points > 60 && points <= 70) { 
				xChange = Math.round(Math.random() * 10) + 12;
				yChange = Math.round(Math.random() * 10) + 12;
			} else if (points > 70 && points <= 80) {
				xChange = Math.round(Math.random() * 10) + 13;
				yChange = Math.round(Math.random() * 10) + 13;
			} else if (points > 80 && points <= 90) {
				xChange = Math.round(Math.random() * 10) + 14;
				yChange = Math.round(Math.random() * 10) + 14;
			} else if (points > 90 && points <= 100) {
				xChange = Math.round(Math.random() * 10) + 15;
				yChange = Math.round(Math.random() * 10) + 15;
			} else if (points > 100) {
				xChange = Math.round(Math.random() * 10) + 20;
				yChange = Math.round(Math.random() * 10) + 20;
			}
		
		} else { //Else if the player misses the target
			hit_in_a_row = 0;
			miss_in_a_row++;
			hit_last_target = false;
		} 
	} 
}

//Create a target object with a random x location, y location, and radius
function Enemy() {
	this.xPosition = Math.round(Math.random() * 1000);
	this.yPosition = Math.round(Math.random() * 500);
	this.radius = Math.round(Math.random() * 30) + 20;
}

//Called repeatedly over and over as soon as game starts and continues
function gameLogic() {
	frame++;

	if ((enemy.radius + radiusChange > minRadius) && (enemy.radius + radiusChange < maxRadius)) {
		enemy.radius += radiusChange;
	} else {
		radiusChange = -radiusChange;
	}

	if ((enemy.xPosition + xChange < 1000 - enemy.radius) && (enemy.xPosition + xChange > 0 + enemy.radius)) {
		enemy.xPosition += xChange;
	} else {
		xChange = -xChange;
	}

	if ((enemy.yPosition + yChange < 500 - enemy.radius) && (enemy.yPosition + yChange > 0 + enemy.radius)) {
		enemy.yPosition += yChange;
	} else {
		yChange = -yChange;
	}
}

function drawScreen() {
	var canvas=document.getElementById("myCanvas");
	var context=canvas.getContext("2d");

	//Draw black playing area
	context.fillStyle="#000000";
	context.fillRect(0,0,1000,500);

	//Display 'flash' effect for background on mouse click
	brightness = Math.round(flashTime / 10 * 255);
	context.fillStyle="rgb("+brightness+", "+brightness+", "+brightness+")";
	context.fillRect(0,0,1000,500);
	 
	context.strokeStyle="#FF0000";
	context.lineWidth=enemy.radius / 5;
	context.fillStyle="#FFFFFF";
	context.beginPath();
	context.arc(enemy.xPosition, enemy.yPosition, enemy.radius, 0, 2*Math.PI);
	context.fill();
	context.beginPath();
	context.arc(enemy.xPosition, enemy.yPosition, enemy.radius, 0, 2*Math.PI);
	context.stroke();
	context.beginPath();
	context.arc(enemy.xPosition, enemy.yPosition, enemy.radius * 2 / 3, 0, 2*Math.PI);
	context.stroke();
	context.beginPath();
	context.arc(enemy.xPosition, enemy.yPosition, enemy.radius * 1 / 3, 0, 2*Math.PI);
	context.stroke();
	context.lineWidth=1;

	//Draw white circle for mouse pointer
	context.strokeStyle="#FFFFFF";
	context.beginPath();
	context.arc(mouseX, mouseY, 20, 0, 2*Math.PI);
	context.stroke();

	//Draw white plus sign in circle for mouse pointer
	context.moveTo(mouseX - 7, mouseY);
	context.lineTo(mouseX + 7, mouseY);
	context.stroke();
	context.moveTo(mouseX, mouseY - 7);
	context.lineTo(mouseX, mouseY + 7);
	context.stroke();

	//Display score in green text in upper left corner of screen
	context.fillStyle="#00FF00";
	context.font = "bold 24px sans-serif";
	context.fillText("Score : " + points, 10, 24);

	//Display red circles on right side of screen to keep track of number of misses in a row
	if (miss_in_a_row == 0) {
		setAllCircles(context, 'black', 'black', 'black', 'black', 'black');
	} else if (miss_in_a_row == 1) {
		setAllCircles(context, 'red', 'black', 'black', 'black', 'black');
	} else if (miss_in_a_row == 2) {
		setAllCircles(context, 'red', 'red', 'black', 'black', 'black');
	} else if (miss_in_a_row == 3) {
		setAllCircles(context, 'red', 'red', 'red', 'black', 'black');
	} else if (miss_in_a_row == 4) {
		setAllCircles(context, 'red', 'red', 'red', 'red', 'black');
	} else if (miss_in_a_row >= 5) {
		setAllCircles(context, 'red', 'red', 'red', 'red', 'red');
		if (lives > 0) {
			lives = lives - 1;
			miss_in_a_row = 0;
		} 
	}
	
	//Create GAME OVER scenario 
	if (lives == 0) {
		playGame = false;
		alert("GAME OVER!");
		lives = -1;
	}
	
	//Load our images for displaying lives
	var oneUP = new Image();
	oneUP.src = 'images/life.png';
	var noLife = new Image();
	noLife.src = 'images/noLife.png';
	
	//Display number of lives on lower right portion of screen
	if (lives == 3) {
		drawLives(context, oneUP, oneUP, oneUP);
	} else if (lives == 2) {
		drawLives(context, noLife, oneUP, oneUP);
	} else if (lives == 1) {
		drawLives(context, noLife, noLife, oneUP);
	} else if (lives == 0) {
		drawLives(context, noLife, noLife, noLife);
	}
	 
	//Counts down for short time to have white background to create 'flash' effect
	if (flashTime > 0) {
		flashTime--;
	}
}

//Draws a simple circle with the given parameters
function circle(context, xRight, yDown, color) {
	context.beginPath();
	context.arc(xRight, yDown, 10, 0, 2*Math.PI, true); 
	context.closePath();
	context.fillStyle = color;
	context.fill();
}

//Draws all five circles in preset location in upper right corner with given color
function setAllCircles(context, color1, color2, color3, color4, color5) {
	circle(context, 970, 60, color1);
	circle(context, 970, 100, color2);
	circle(context, 970, 140, color3);
	circle(context, 970, 180, color4);
	circle(context, 970, 220, color5);
} 

//Draw lives or black squares over lives in lower left corner
function drawLives(context, img1, img2, img3) {
	//context.drawImage(object, x, y, width, height
	context.drawImage(img1, 860, 450, 40, 40);
	context.drawImage(img2, 900, 450, 40, 40);
	context.drawImage(img3, 940, 450, 40, 40);
}

//Toggle music on and off, and make all silent so no music and no gunshot
function setMusic(value) {
	if (value == 'musicOn') {
		document.getElementById('music').play();
		document.getElementById('gunshot').muted = false;
	} else if (value == 'musicOff') {
		document.getElementById('music').pause();
	} else if (value == 'silence') {
		document.getElementById('music').pause();
		document.getElementById('gunshot').muted = true;
	}
}