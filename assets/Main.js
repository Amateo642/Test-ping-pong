// Pong Game
// Developed by Carlos Yanez

/* Define Canvas */

var canvas;
var stage;

// Graphics
//[Background]

var bgImg = new Image();
var bg;

//[Title View]
 
var mainImg = new Image();
var main;
var startBImg = new Image();
var startB;
var creditsBImg = new Image();
var creditsB;

//[Title View Group]

var TitleView = new Container();

//[Credits]

var creditsViewImg = new Image();
var credits;

//[Game View]

var playerImg = new Image();
var player;
var ballImg = new Image();
var ball;
var cpuImg = new Image();
var cpu;
var winImg = new Image();
var win;
var loseImg = new Image();
var lose;

//[Score]

var playerScore;
var cpuScore;

// Variables

var xSpeed = 5;
var ySpeed = 5;
var gfxLoaded = 0;
var tkr = new Object;

// Main Function

function Main()
{
	/* Link Canvas */
	
	canvas = document.getElementById('Pong');
  	stage = new Stage(canvas);
  		
  	stage.mouseEventsEnabled = true;
  	
  	/* Sound */

	SoundJS.addBatch([
		{name:'hit', src:'hit.mp3', instances:1},
		{name:'playerScore', src:'playerScore.mp3', instances:1},
		{name:'enemyScore', src:'enemyScore.mp3', instances:1},
		{name:'wall', src:'wall.mp3', instances:1}]);
  		
  	/* Load GFX */
  		
  	bgImg.src = 'bg.png';
  	bgImg.name = 'bg';
  	bgImg.onload = loadGfx;
  	
  	mainImg.src = 'main.png';
  	mainImg.name = 'main';
  	mainImg.onload = loadGfx;
	
	startBImg.src = 'startB.png';
	startBImg.name = 'startB';
	startBImg.onload = loadGfx;
	
	creditsBImg.src = 'creditsB.png';
	creditsBImg.name = 'creditsB';
	creditsBImg.onload = loadGfx;
	
	creditsViewImg.src = 'credits.png';
	creditsViewImg.name = 'credits';
	creditsViewImg.onload = loadGfx;
	
	playerImg.src = 'paddle.png';
	playerImg.name = 'player';
	playerImg.onload = loadGfx;
	
	ballImg.src = 'ball.png';
	ballImg.name = 'ball';
	ballImg.onload = loadGfx;
	
	cpuImg.src = 'paddle.png';
	cpuImg.name = 'cpu';
	cpuImg.onload = loadGfx;
	
	winImg.src = 'win.png';
	winImg.name = 'win';
	winImg.onload = loadGfx;
	
	loseImg.src = 'lose.png';
	loseImg.name = 'lose';
	loseImg.onload = loadGfx;
	
	/* Ticker */
	
	Ticker.setFPS(30);
	Ticker.addListener(stage);
}

function loadGfx(e)
{
	if(e.target.name = 'bg'){bg = new Bitmap(bgImg);}
	if(e.target.name = 'main'){main = new Bitmap(mainImg);}
	if(e.target.name = 'startB'){startB = new Bitmap(startBImg);}
	if(e.target.name = 'creditsB'){creditsB = new Bitmap(creditsBImg);}
	if(e.target.name = 'credits'){credits = new Bitmap(creditsViewImg);}
	if(e.target.name = 'player'){player = new Bitmap(playerImg);}
	if(e.target.name = 'ball'){ball = new Bitmap(ballImg);}
	if(e.target.name = 'cpu'){cpu = new Bitmap(cpuImg);}
	if(e.target.name = 'win'){win = new Bitmap(winImg);}
	if(e.target.name = 'lose'){lose = new Bitmap(loseImg);}
	
	gfxLoaded++;
	
	if(gfxLoaded == 10)
	{
		addTitleView();
	}
}

// Add Title View Function

function addTitleView()
{
	startB.x = 240 - 31.5;
	startB.y = 160;
	startB.name = 'startB';
	
	creditsB.x = 241 - 42;
	creditsB.y = 200;
	
	TitleView.addChild(main, startB, creditsB);
	stage.addChild(bg, TitleView);
	stage.update();
	
	// Button Listeners
	
	startB.onPress = tweenTitleView;
	creditsB.onPress = showCredits;
}

function showCredits()
{
	// Show Credits
		
	credits.x = 480;
		
	stage.addChild(credits);
	stage.update();
	Tween.get(credits).to({x:0}, 300);
	credits.onPress = hideCredits;
}

// Hide Credits

function hideCredits(e)
{
	Tween.get(credits).to({x:480}, 300).call(rmvCredits);
}

// Remove Credits

function rmvCredits()
{
	stage.removeChild(credits);
}

// Tween Title View

function tweenTitleView()
{		
	// Start Game
		
	Tween.get(TitleView).to({y:-320}, 300).call(addGameView);
}

// Add Game View

function addGameView()
{
	// Destroy Menu & Credits screen
	
	stage.removeChild(TitleView);
	TitleView = null;
	credits = null;
	
	// Add Game View
	
	player.x = 2;
	player.y = 160 - 37.5;
	cpu.x = 480 - 25;
	cpu.y = 160 - 37.5;
	ball.x = 240 - 15;
	ball.y = 160 - 15;
	
	// Score
	
	playerScore = new Text('0', 'bold 20px Arial', '#A3FF24');
	playerScore.maxWidth = 1000;	//fix for Chrome 17
	playerScore.x = 211;
	playerScore.y = 20;
	
	cpuScore = new Text('0', 'bold 20px Arial', '#A3FF24');
	cpuScore.maxWidth = 1000;	//fix for Chrome 17
	cpuScore.x = 262;
	cpuScore.y = 20;
	
	stage.addChild(playerScore, cpuScore, player, cpu, ball);
	stage.update();
	
	// Start Listener 
	
	bg.onPress = startGame;
}

// Player Movement

function movePaddle(e)
{
	// Mouse Movement
	
	player.y = e.stageY;
}

// Start Game Function

function startGame(e)
{
	bg.onPress = null;
	stage.onMouseMove = movePaddle;
	
	Ticker.addListener(tkr, false);
	tkr.tick = update;
}

/* Reset */

function reset()
{
	ball.x = 240 - 15;
	ball.y = 160 - 15;
	player.y = 160 - 37.5;
	cpu.y = 160 - 37.5;
	
	stage.onMouseMove = null;
	Ticker.removeListener(tkr);
	bg.onPress = startGame;
}

// Update Function

function update()
{
	// Ball Movement 

	ball.x = ball.x + xSpeed;
	ball.y = ball.y + ySpeed;
	
	// Cpu Movement
	
	if(cpu.y < ball.y) {
		cpu.y = cpu.y + 2.5;
	}
	else if(cpu.y > ball.y) {
		cpu.y = cpu.y - 2.5;
	}
	
	// Wall Collision 

	if((ball.y) < 0) { ySpeed = -ySpeed; SoundJS.play('wall');};//Up
	if((ball.y + (30)) > 320) { ySpeed = -ySpeed; SoundJS.play('wall');};//down
	
	/* CPU Score */
	
	if((ball.x) < 0)
	{
		xSpeed = -xSpeed;
		cpuScore.text = parseInt(cpuScore.text + 1);
		reset();
		SoundJS.play('enemyScore');
	}
	
	/* Player Score */
	
	if((ball.x + (30)) > 480)
	{
		xSpeed = -xSpeed;
		playerScore.text = parseInt(playerScore.text + 1);
		reset();
		SoundJS.play('playerScore');
	}
	
	/* Cpu collision */
	
	if(ball.x + 30 > cpu.x && ball.x + 30 < cpu.x + 22 && ball.y >= cpu.y && ball.y < cpu.y + 75)
	{
		xSpeed *= -1;
		SoundJS.play('hit');
	}
	
	/* Player collision */
	
	if(ball.x <= player.x + 22 && ball.x > player.x && ball.y >= player.y && ball.y < player.y + 75)
	{
		xSpeed *= -1;
		SoundJS.play('hit');
	}
	
	/* Stop Paddle from going out of canvas */
	
	if(player.y >= 249)
	{
		player.y = 249;
	}
	
	/* Check for Win */
	
	if(playerScore.text == '10')
	{
		alert('win');
	}
	
	/* Check for Game Over */
	
	if(cpuScore.text == '10')
	{
		alert('lose');
	}
}

function alert(e)
{
	Ticker.removeListener(tkr);
	stage.onMouseMove = null;
	bg.onPress = null
	
	if(e == 'win')
	{
		win.x = 140;
		win.y = -90;
	
		stage.addChild(win);
		Tween.get(win).to({y: 115}, 300);
	}
	else
	{
		lose.x = 140;
		lose.y = -90;
	
		stage.addChild(lose);
		Tween.get(lose).to({y: 115}, 300);
	}
}