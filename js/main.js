var canvas; //Will be linked to the canvas in our index.html page
var stage; //Is the equivalent of stage in AS3; we'll add "children" to it
 
// Graphics
//[Background]
 
var bg; //The background graphic
 

//[Title View]
  
var main; //The Main Background
var startB; //The Start button in the main menu
var creditsB; //The credits button in the main menu
 

//[Credits]
 
var credits; //The Credits screen
 

//[Game View]
 
var player; //The player paddle graphic
var ball; //The ball graphic
var cpu; //The CPU paddle
var win; //The winning popup
var lose; //The losing popup


//[Score]

var playerScore; //The main player score
var cpuScore; //The CPU score
var cpuSpeed=6; //The speed of the CPU paddle; the faster it is the harder the game is


// Variables
 
var xSpeed = 5;
var ySpeed = 5;


// обьект ticker Эквивалент onEnterFrame благодаря которму можно выполнять код каждую долю секунды
// переменная ссылка на него. 

var tkr = new Object;


//preloader
var preloader; //будет содержаться объект PreloadJS
var manifest; //будет находиться список файлов, которые нам необходимо загрузить.
var totalLoaded = 0; //будет содержаться число уже загруженных  файлов.

var TitleView = new Container(); // изображения для их совместного отображения


function Main() {
    /* Link Canvas */
     
    canvas = document.getElementById('PongStage');
    stage = new Stage(canvas);
    //присваиваем в переменную canvas объект Canvas PongStage из файла index.html и затем с его помощью создаем объект класса Stage (* сцену). (Благодаря ей мы сможем размещать объекты на canvas)
         
    stage.mouseEventsEnabled = true; //можем воспользоваться событиями, возникающими при действиях с мышкой, для реагирования на движения и клики мышкой.
     
     
    /* Set The Flash Plugin for browsers that don't support SoundJS */ //настраиваем расположение плагина для звука Flash для тех браузеров, которые не поддерживают HTML5 Audio.

    SoundJS.FlashPlugin.BASE_PATH = "assets/";
    if (!SoundJS.checkPlugin(true)) {
      alert("Error!");
      return;
    }
 
    // manifest мы размещаем массив файлов, которые хотим загрузить (и задаем для каждого  уникальный ID). Каждый звук представлен в двух форматах – MP3 и OGG – поскольку браузеры поддерживают разные форматы.
    manifest = [
                {src:"bg.png", id:"bg"},
                {src:"main.png", id:"main"},
                {src:"startB.png", id:"startB"},
                {src:"creditsB.png", id:"creditsB"},
                {src:"credits.png", id:"credits"},
                {src:"paddle.png", id:"cpu"},
                {src:"paddle.png", id:"player"},
                {src:"ball.png", id:"ball"},
                {src:"win.png", id:"win"},
                {src:"lose.png", id:"lose"},
                {src:"playerScore.mp3|playerScore.ogg", id:"playerScore"},
                {src:"enemyScore.mp3|enemyScore.ogg", id:"enemyScore"},
                {src:"hit.mp3|hit.ogg", id:"hit"},
                {src:"wall.mp3|wall.ogg", id:"wall"}
            ];
 
 
    //создаем новый объект PreloadJS и помещаем его в переменную preloader, затем задаем метод для обработки каждого события (onProgress, onComplete, onFileLoad). Наконец, мы используем preloader для загрузки ранее созданного списка файлов.
    preloader = new PreloadJS();
    preloader.installPlugin(SoundJS);
    preloader.onProgress = handleProgress;
    preloader.onComplete = handleComplete;
    preloader.onFileLoad = handleFileLoad;
    preloader.loadManifest(manifest);
 
    /* Ticker */
    //Здесь мы добавляем объект Ticker на сцену и задаем частоту смены кадров равной 30 FPS. использовать позже в игре для реализации функциональности enterFrame.  
    Ticker.setFPS(30);
    Ticker.addListener(stage);
}

//ф-я для предварительной загрузки.

function handleProgress(event) {
    //use event.loaded to get the percentage of the loading
}
 
function handleComplete(event) {
    //triggered when all loading is complete
}
 
function handleFileLoad(event) {
    //triggered when an individual file completes loading
        
    switch(event.type)
    {
    case PreloadJS.IMAGE:
    //image loaded
        var img = new Image();
        img.src = event.src;
        img.onload = handleLoadComplete;
        window[event.id] = new Bitmap(img);
    break;

    case PreloadJS.SOUND:
    //sound loaded
    handleLoadComplete();
    break;
    }
}

function handleLoadComplete(event) {
 
   totalLoaded++; //мы увеличиваем значение переменной(в которой содержится число ресурсов, загруженных на данный момент)
    
   if(manifest.length==totalLoaded) //проверяем, совпадает ли число элементов в manifest с числом загруженных ресурсов
   {
       addTitleView(); //переходим к экрану Main Menu 
   }
}

function addTitleView() {
    //размещаем изображения для фона, кнопок Start и Credits (* список разработчиков) на сцене
    //console.log("Add Title View");
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

function showCredits() {
    // Show Credits
         
    credits.x = 480;
         
    stage.addChild(credits);
    stage.update();
    Tween.get(credits).to({x:0}, 300);
    credits.onPress = hideCredits;
}
 
// Hide Credits
 
function hideCredits(e) {
    Tween.get(credits).to({x:480}, 300).call(rmvCredits);
}
 
// Remove Credits
 
function rmvCredits() {
    stage.removeChild(credits);
}
 
// Tween Title View
 
function tweenTitleView() {       
    // Start Game
         
    Tween.get(TitleView).to({y:-320}, 300).call(addGameView);
}


// Добавляем все необходимые ресурсы на сцену

function addGameView() {
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
    playerScore.x = 211;
    playerScore.y = 20;
     
    cpuScore = new Text('0', 'bold 20px Arial', '#A3FF24');
    cpuScore.x = 262;
    cpuScore.y = 20;
     
    stage.addChild(playerScore, cpuScore, player, cpu, ball);
    stage.update();
     
    // Start Listener 
     
    bg.onPress = startGame;
}


function startGame(e)
{
    bg.onPress = null;
    stage.onMouseMove = movePaddle; // происходит движение нашей ракетки
     
    Ticker.addListener(tkr, false);
    tkr.tick = update; //добавляем обработчик для события tick, за счет чего будет вызвана функция update для каждого фрейма.
}


function movePaddle(e) {
    // Mouse Movement
    player.y = e.stageY; //размещаем ракетку в координате у
}
 
/* Reset */
 
function reset() {
    ball.x = 240 - 15;
    ball.y = 160 - 15;
    player.y = 160 - 37.5;
    cpu.y = 160 - 37.5;
     
    stage.onMouseMove = null;
    Ticker.removeListener(tkr);
    bg.onPress = startGame;
}

//сообщение о проигрыше или выигрыше

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


//выполняется для каждого фрейма игры

function update() {
    // Ball Movement 
 
    ball.x = ball.x + xSpeed; //в каждом фрейме мяч будет двигаться
    ball.y = ball.y + ySpeed; //в соответствие с его скоростью по х и у
     
    // Cpu Movement
    // ракетка компьютера просто следует за мячом
    
    if ((cpu.y + 32) < (ball.y - 14)) { //просто сравниваем положение центра ракетки с положение мяча
        cpu.y = cpu.y + cpuSpeed;
    }
    else if ((cpu.y + 32) > (ball.y - 14)) {
        cpu.y = cpu.y - cpuSpeed;
    }
     
    // Wall Collision 
    //Если мяч сталкивается с верхней или нижней границей экрана, то мяч изменяет свое направление и мы проигрываем звук Wall Hit (* звук столкновения с границей)

    if ((ball.y) < 0) { 
        ySpeed = -ySpeed;
        SoundJS.play('wall'); 
    }; //Up
    if ((ball.y + (30)) > 320) { 
        ySpeed = -ySpeed; 
        SoundJS.play('wall');}; // down
     
    /* CPU Score */
     
        //если мяч пересекает левую или правую границы, то происходит увеличение числа очков игрока или соперника, управляемого компьютером, соответственно, проигрывание звука и сброс значений положения объектов при помощи функции reset

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
     
        //каждый раз после столкновении мяча с одной из ракеток мяч изменяет свое направление и проигрывается соответствующий звук.

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
    //Если ракетка игрока выходит за границы, то мы возвращаем ее обратно

    if(player.y >= 249)
    {
        player.y = 249;
    }
     
    /* Check for Win */
        //проверяем, достигло ли число очков кого-либо из игроков 10, и если это так, то показываем пользователю сообщение о победе или поражении
        
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