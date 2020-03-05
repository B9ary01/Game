/*

The Game Project 5 - Bring it all together

*/

//declaring variables

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isJumping;
var isDead;
var game_score;
var flagpole;
var lives;
var platforms;
var enemies;

var jumpSound;

var start=false;
var snowTimes=[];

 var star,
    voidzone,
    leafArr,
    blowAsh, //end point Fireworks
    flagpole;

//game mechanism related variables
var scoreText;
var emit;


/*function preload()
{
    //soundFormats('mp3','wav');
    
    //load your sounds here
    //jumpSound = loadSound('assets/jump.wav');
    //jumpSound.setVolume(0.1);
    
    //rightturn sound
    //rightside = loadSound('assets/1.wav');
   // rightside.setVolume(0.3);
    
    //leftturn sound
   // leftside = loadSound('assets/1.wav');
   // leftside.setVolume(0.3);
    
    //falling through canyon sound
  //  fall= loadSound('assets/e.mp3');
   // fall.setVolume(0.1);
    
    //collecting items sound
  //  collectT= loadSound('assets/6.wav');
   // collectT.setVolume(0.2);
    
    //intcact with enemies sound
    //enem= loadSound('assets/0.wav');
  //  enem.setVolume(0.3);
    
    //game over sound
   // gameover= loadSound('assets/g.mp3');
  //  gameover.setVolume(0.3);
    
  
}
*/



function setup()
{
      
       createCanvas(windowWidth, windowHeight);


	floorPos_y = height * 3/4;
    lives =5;
     
//emitter
    
emit=new emitter(width/2+146, height-12, 0, -1, 30, color(180,34,34));
emit.startEmitter(80, 200);       
    
    startGame();
    
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw()
{
    //for phone only
    if(lives ==3)
    {
        
        if(gameChar_y >700 && lives >0)
        {
            startGame();
            return;
        }
    }
    /*
    if(start ==true)
    {
        
        if(gameChar_y >700 && lives >0)
        {
            startGame();
            return;
        }
*/
        
	background(44, 25, 105); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    //pushing 
    push();
    translate(scrollPos,0);
    
    //calling functions
    drawClouds();
    drawTrees();
    drawMountains();
    

    //Danger sign code
    stroke(150);
    strokeWeight(5);
    line(-870, floorPos_y, -870, floorPos_y - 100);
    line(-820, floorPos_y, -820, floorPos_y - 100);

    stroke(0);
    strokeWeight(3);
    fill(255,0,0);
    rect(-940, floorPos_y -200, 200, 100);
    fill(255);
    noStroke();
    textSize(20);
    text("DANGER DEATH", -920,floorPos_y-140);


     // draw cloud

    for(s=0;s<clouds.length;s++){

    fill(255);
    noStroke();
    ellipse(296+clouds[s],80+floorPos_y/7,56,48);
    ellipse(279+clouds[s],98+floorPos_y/7,75,50);
    ellipse(320+clouds[s],88+floorPos_y/7,60,65);
    ellipse(329+clouds[s],99+floorPos_y/7,90,44);
    }

    // Draw mountains.
    
    for(var m=0;m<mountains.length;m++){
	fill(192,192,189);
    triangle(656+mountains[m], floorPos_y/270+432, 500+mountains[m], floorPos_y/270+432, 580+mountains[m], floorPos_y/270+178);
    triangle(749+mountains[m], floorPos_y/270+432, 615+mountains[m], floorPos_y/270+432, 670+mountains[m], floorPos_y/270+149);
    
    }
    
	// Draw trees.
    
    for(var u=0;u<trees_x.length;u++)
        {
    //strokeWeight(2);
    stroke(1);

    fill(34,139,34);
     
    fill(139,69,19);
    rect(trees_x[u]-10+380,floorPos_y-51,20,50);
    fill(134,255,0);

    ellipse(trees_x[u]-15+380,floorPos_y-92,70,80);
    ellipse(trees_x[u]+15+380,floorPos_y-92,65,80);
    ellipse(trees_x[u]+380,floorPos_y-92,66,80);
    
    
    }
    
    //birds
    
    for(var v=0;v<birds.length;v++){
      
    fill(199,8,88);
    noStroke();
    arc(birds[v]+188, floorPos_y-201, 22, 37, 12, PI + QUARTER_PI);
    fill(44,25,105);
    arc(birds[v]+188,floorPos_y-200, 22, 38, 12, PI + QUARTER_PI);
 
        
    fill(199,8,88);
    noStroke();
    arc(birds[v]+215, floorPos_y-202, 22, 37, 12, PI + QUARTER_PI);
    fill(44,25,105);
    arc(birds[v]+215, floorPos_y-201, 22, 38, 12, PI + QUARTER_PI);
    }



	// Draw canyons
    for(g=0;g<canyons.length;g++){
       
       //call functions
       drawCanyon(canyons[g]);
       checkCanyon(canyons[g]);
        
    }
    
    //plays sound effect when player is falling
     if(isPlummeting==true){
        gameChar_y+=20;
         //fall.play();
    }


	// Draw collectable items
    for(h=0;h<collectables.length;h++){
        
       if(!collectables[h].isFound){
       
     //calling function 
       drawCollectable(collectables[h]);
       checkCollectable(collectables[h]);
        }

    }
    
    //emitter function
    emit.updateParticles();
        
    //flagpole call 
    renderFlagpole();


    //game platform 
    
    for(i=0;i<platforms.length;i++)
    {
        platforms[i].draw();
        
    }
    
    //enemies 
    for(a=0;a<enemies.length;a++)
    {
        enemies[a].update();
        enemies[a].draw();
        
        if(enemies[a].isContact(gameChar_world_x, gameChar_y))
        {
            startGame();
            break;
        }

    }
        
       pop();


   
    // Draw game character.
        
   drawGameChar(); 
   
      
    // Draw warnings
    
    if(gameChar_world_x < -100 && gameChar_world_x > -400 && isLeft == true)
    {
        fill(255 + sin(frameCount*0.1) * 128);
        textSize(30);
        text("Warning!\n Slow Down!", 412, 280);
    }
    //if the character keeps going leftside the following text is displayed
    if(gameChar_world_x < -500 && gameChar_world_x > -800 && isLeft == true)
    {
        fill(255 + sin(frameCount*0.1) * 128);
        textSize(50);
        text("WRONG-WAY!", 370, 300);
    }
    
    //if the character keeps going leftside the following text is displayed
    if(gameChar_world_x < -990 && gameChar_world_x > -1500 && isLeft == true)
    {
        fill(255 + sin(frameCount*0.1) * 128);
        textSize(70);
        text("GO BACK NOW?!!!", 100, 300);
    }
    
    
    //CONDITION FOR GAME OVER 

    if(lives==0){
    fill(223);
    textSize(25);    
    text("GAME OVER! - REFRESH PAGE TO CONTINUE",225,260);
    //gameover.play();
    return true;
       
      }
     
    //displaying score
    fill(255,255,0);
    noStroke();
    textSize(25);
    text("SCORE: "+game_score,20,50);
    
     //condition which shows following text when character reaches to the flagpole 
    if(flagpole.isReached==1)
    {
    text("YAY! - LEVEL COMPLETE - PLEASE REFRESH PAGE TO CONTINUE",260,260);
    
    //skyFall();
 
    return true;
    }
        
    //checkFlagpole is called if the flagple is not reached

     if(flagpole.isReached !=true)
       {
       checkFlagpole();
           
       }
        

    
    //Draw screen text for the life tokens.
    fill(255,255,0);
    noStroke();
    textSize(25);
    textStyle(BOLD);
    text("LIVES: " + lives, width-130, 50);
    
    //displaying lives in ellipse shape
    for(var i = 0; i< lives; i++)
    {
    fill(255,15,220);
    noStroke();
    ellipse(i*40+460 + random(-2,3), 20, 30,30);
    }
        
        
     //declaring variable t
    var t = frameCount / 80;

    for (var i = 0; i < random(7); i++)
    {
        snowTimes.push(new snowTime()); // append snowtime object
    }

   // loop through snowtime with a for loop
    for (var flake of snowTimes)
    {
        
        flake.update(t); // update snow position
        flake.display(); // draw snowtime
    }
        
        
    
    //fallinng a canyon
     if(gameChar_y>700&&lives>=0){ // when the game character falls down the canyon it resets the game
        startGame();
        isPlummeting=false;

    }
   
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	  {
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.

    if(gameChar_y<floorPos_y)
        {
            var isContact=false;
            for(var i=0;i<platforms.length;i++)
            {
                if(platforms[i].checkContact(gameChar_world_x,gameChar_y))
                    {
                        isContact=true;
                        break;
                    }
            }
            if(isContact==false)
            {
                isFalling=true;
                gameChar_y +=2;
            }
            else {
                isFalling=false;
            }
        }
    else {
        isFalling=false;
    }
    

   
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
    }
    /*
    else
    {
         push();
        fill(160, 55, 255);
        noStroke();
        textSize(40);
        text("Welcome to GOKYO-LAND.", 250,240);
        text(" Press ENTER to Start.", 290,310);
        pop();
        
        
    }
    */
    
    
    

// ---------------------
// Key control functions
// ---------------------

function keyPressed(){

	
    
    //code to link all level together into a single multi-level game
    if(flagpole.isReached && keyCode ==32)
       {    
          nextLevel();
          return 
        }
      else if(lives == 0 && keyCode == 32)
        {
          returnToStart();
          return 
        }
    
    //left move key condition
      if(keyCode==37)
       {
          // leftside.play(); 
           isLeft=true; 
       }
    //right move key condition
      if(keyCode==39)
       {
          // rightside.play(); 
           isRight=true;
       }
   
    
     // Space tab to jump character
    if (keyCode == 32)
    {
        if(!isFalling)
        {
            //jumpSound.play();
            gameChar_y -= 120;
        }
    }
    
    

     // if lives is still remained, game starts again when charcter loses lives but when all live is finished player needs to hit Enter tab to play again
    
    //for starting game on phone
    if(lives == 0 || flagpole.isReached == true)
    {
        lives =4;
        flagpole.isReached = false;
        startGame();
    }
    /*
      if (keyCode == 13 && (lives == 0 || flagpole.isReached == true))
    {
        lives =4;
        flagpole.isReached = false;
        startGame();
    }

    else if(keyCode == 13 && start == false)
    {
        start = true;
        startGame();
    }
    */
   }

//declaring keyReleased function
function keyReleased()
   {


    if(key == 'A' || keyCode == 37)
	{
		isLeft = false;
	}

	if(key == 'D' || keyCode == 39)
	{
		isRight = false;
	}  
    
    if(keyCode==32)
     {
        //isPlumeting=false;
         isFalling=false; 
     }
      

}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    

	if(isLeft && isFalling)
	{
   //  jumping-left code
        
    fill(222,184,138);
    ellipse(gameChar_x-1,gameChar_y-62,20,22);//face
    
    fill(139,59,22);
    strokeWeight(2);
     rect(gameChar_x -6,gameChar_y-51,10,25);//body

    rect(gameChar_x -5,gameChar_y-28,4,17);//lef right

    rect(gameChar_x -0,gameChar_y-40,4,29);//right leg
    fill(99,90,80);
    fill(99,190,80);
    rect(gameChar_x -6,gameChar_y-54,10,4);
    
    
    stroke(222,3,3);
    strokeWeight(3);
    point(gameChar_x -9, gameChar_y-65);//left eye
    point(gameChar_x-3, gameChar_y-65);//right eye 
    
    fill(173,25,120);
    fill(22,0,88);

    strokeWeight(2);
    rect(gameChar_x-4,gameChar_y-49,5,22);

	}
	else if(isRight && isFalling)
	{
    //  jumping-right code
    fill(222,184,138);
    ellipse(gameChar_x-1,gameChar_y-62,20,22);//face
    fill(139,59,22);
    strokeWeight(2);
    rect(gameChar_x -6,gameChar_y-51,10,25);//body
    
    rect(gameChar_x -5,gameChar_y-28,4,17);//lef right

    rect(gameChar_x -0,gameChar_y-40,4,29);//right leg
    
    fill(99,190,80);
    rect(gameChar_x -6,gameChar_y-55,10,4);
    
    stroke(222,3,3);
    strokeWeight(3);
    point(gameChar_x +7, gameChar_y-65);//left eye
    point(gameChar_x+2, gameChar_y-65);//right eye
    
    fill(173,25,120);
    fill(22,0,88);

    strokeWeight(2);
    rect(gameChar_x-2,gameChar_y-49,5,22);

    }
	else if(isLeft)
	{
		
    // add your walking left code
        
    fill(222,184,138);
    ellipse(gameChar_x-1,gameChar_y-48,20,22);//face
    fill(139,59,22);
    strokeWeight(2);
    rect(gameChar_x -6,gameChar_y-37,10,25);//body

    rect(gameChar_x -5,gameChar_y-14,4,17);//left leg

    rect(gameChar_x -0,gameChar_y-25,4,29);//right leg
    
    fill(99,190,80);
    rect(gameChar_x -6,gameChar_y-40,10,4);
    
    fill(99,90,80);
    stroke(222,3,3);
    strokeWeight(3);
    point(gameChar_x -9, gameChar_y-47);//left eye
    point(gameChar_x-3, gameChar_y-47);//right eye

    
    fill(173,25,120);
    fill(22,0,88);
    strokeWeight(2);
    rect(gameChar_x -5,gameChar_y-35,4,22);
    
    }
	else if(isRight)
	{
     // walking right code
        
    fill(222,184,138);
    ellipse(gameChar_x-1,gameChar_y-48,20,22);//face
    
    fill(139,59,22);
    strokeWeight(2);
    rect(gameChar_x -6,gameChar_y-37,10,25);//body
    
    rect(gameChar_x -5,gameChar_y-14,4,17);//lef right

    rect(gameChar_x,gameChar_y-25,4,29);//right leg
    
    fill(99,190,80);
    rect(gameChar_x -6,gameChar_y-40,10,4);
        
    stroke(222,3,3);
    strokeWeight(3);
    point(gameChar_x +8, gameChar_y-47);//left eye
    point(gameChar_x+2, gameChar_y-47);//right eye
    
    fill(173,25,120);
    fill(22,0,88);
    strokeWeight(2);
    rect(gameChar_x-2,gameChar_y-35,5,22);

    }
	else if(isFalling || isPlummeting)
	{
     //  jumping facing forwards code
     fill(222,184,138);
     ellipse(gameChar_x-1,gameChar_y-62,20,22); //face
    
     fill(139,59,22);
     strokeWeight(2);
     rect(gameChar_x -12,gameChar_y-51,22,25); //body
     rect(gameChar_x +1,gameChar_y-40,4,29);//legs
     rect(gameChar_x -7,gameChar_y-40,4,29);
    
     fill(99,190,80);
     rect(gameChar_x -8,gameChar_y-53,13,4);//chest
     
     stroke(222,3,3);
     strokeWeight(3);
     point(gameChar_x -6, gameChar_y-62);
     point(gameChar_x +3, gameChar_y-62);

    
    fill(173,25,120);
    fill(22,0,88);
    strokeWeight(2);
    rect(gameChar_x -15,gameChar_y-49,5,22);
    rect(gameChar_x+7 ,gameChar_y-49,5,22);
    

	}
	else
	{
     // standing front facing code
    fill(222,184,138);
    ellipse(gameChar_x-1,gameChar_y-48,20,22);
    
    fill(139,59,22);
    strokeWeight(2);
    rect(gameChar_x -12,gameChar_y-37,22,25);//body
    
   rect(gameChar_x ,gameChar_y-26,4,29);//legs
    rect(gameChar_x -7,gameChar_y-26,4,29);
    
    fill(99,190,80);
    rect(gameChar_x -8,gameChar_y-40,13,4);//neck
    
    stroke(222,3,3);
    strokeWeight(3);
    point(gameChar_x -6, gameChar_y-47);
    point(gameChar_x +3, gameChar_y-47);
    
    fill(173,25,120);
    fill(22,0,88);

    strokeWeight(2);
    rect(gameChar_x -14,gameChar_y-36,5,23);//hands
    rect(gameChar_x+8 ,gameChar_y-36,5,23);

   }

}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
//Create three new functions drawClouds, drawMountains, drawTrees
function drawClouds()
{
for(s=0;s<clouds.length;s++){

fill(225);
 
     
ellipse(clouds[s].x-270, clouds[s].y-20,clouds[s].size*32,clouds[s].size+77);

ellipse(clouds[s].x-215, clouds[s].y+15, clouds[s].size+79, clouds[s].size+48);

ellipse(clouds[s].x-233, clouds[s].y-10 , clouds[s].size+89, clouds[s].size+59);
ellipse(clouds[s].x-290, clouds[s].y+10 , clouds[s].size*70-50, clouds[s].size+46);
    

ellipse(clouds[s].x-270-40, clouds[s].y-20,clouds[s].size*32,clouds[s].size+65);

ellipse(clouds[s].x-215-40, clouds[s].y+15, clouds[s].size+79, clouds[s].size+48);

ellipse(clouds[s].x-233-40, clouds[s].y-10 , clouds[s].size+89, clouds[s].size+59);
ellipse(clouds[s].x-290-40, clouds[s].y+10 , clouds[s].size*70-50, clouds[s].size+45);    
    

    // conditonals that move the clouds across the screen
		
    if(clouds[s].x > -400)
				{
					clouds[s].x -= clouds[s].speed+0.09;
				}

			if(clouds[s].x <= -2200)
				{
					clouds[s].x = width+ 1600;
				}
    
    }

}

// Function to draw mountains objects.
function drawMountains()
{
 for(var m=0;m<mountains.length;m++){
	fill(122,166,220);
    triangle(650+mountains[m], floorPos_y/270+430, 500+mountains[m], floorPos_y/270+430, 580+mountains[m], floorPos_y/270+176);
    triangle(747+mountains[m], floorPos_y/270+430, 613+mountains[m], floorPos_y/270+430, 670+mountains[m], floorPos_y/270+147);
  
}
}

//Function to draw trees objects.
function drawTrees()
{
    
for(var u=0;u<trees_x.length;u++)
        {
    // noStroke();

    fill(34,139,34);
    //fill(139,69,19);
    rect(trees_x[u]+380,floorPos_y-12,10,3);
    fill(134,255,0);

    ellipse(trees_x[u]-15+380,floorPos_y-92,70,80);
    ellipse(trees_x[u]+15+380,floorPos_y-92,65,80);
    ellipse(trees_x[u]+380,floorPos_y-92,66,80);
    
        }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
     fill(87,59,12); 
    rect(t_canyon.xpos+112,432,t_canyon.width,160); 
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
   
 if(gameChar_world_x>=t_canyon.xpos+115&&gameChar_world_x<=t_canyon.xpos+204
       && gameChar_y>=floorPos_y) // logic to check if the player has went down the canyon
    {
        isPlummeting=true;

    }

     
}
          

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{     
    
    fill(250,88,10);

    stroke(19,200,28);
    arc(t_collectable.x_pos, t_collectable.y_pos, 29, 39, 19, PI + QUARTER_PI);
    noStroke();
   
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{

    var dis = dist(gameChar_world_x,gameChar_y,
                   t_collectable.x_pos,t_collectable.y_pos); //creating a variable which measures the value from the character to the collectable item.
    if(dis<45 && gameChar_y==432){
        t_collectable.isFound=true; //sets t collectable to true if charachter is in a postion
        game_score+=2 //the score is added by 2
        //collectT.play();//sound for collecting item

    }    
    
}

function renderFlagpole()
{   
    push();
    stroke(177,99,122);
    strokeWeight(4);
    line(flagpole.x_pos, floorPos_y,flagpole.x_pos,floorPos_y-200);
    
    pop();
    //if charcter reaches flagpole, flag goes up
    if(flagpole.isReached){
        fill(20,62,225);
        triangle(flagpole.x_pos+2,floorPos_y-200,flagpole.x_pos+33,floorPos_y-150,flagpole.x_pos+2,floorPos_y-120,);
        ashHere();
        
       }
    else{
        fill(188,2,210);
        triangle(flagpole.x_pos+2,floorPos_y-80,flagpole.x_pos+33,floorPos_y-50,flagpole.x_pos+2,floorPos_y+2,);
        
         }
    
   
}

//if abs of character and flagpole x_pos is less than 18, gameover sound is played
function checkFlagpole()
{
    var arun=abs(gameChar_world_x-flagpole.x_pos);
    if(arun<18)
    {
        //gameover.play();
        flagpole.isReached =true;
        startGame();
    }
    
}

function startGame(){
    gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    
    trees_x=[-96,480,744,1115,1445];
    
    clouds = [
		{x: 600, y: 63, size:2, speed: 0.1},
		{x: 900, y: 63, size:2, speed: 0.1},
		{x: 1400, y: 63, size:2, speed: 0.1},
		{x: 1900, y: 63, size:2, speed: 0.1},
        {x: 600, y: 153, size:2, speed: 0.5},
		{x: 900, y: 153, size:2, speed: 0.5},
		{x: 1400, y: 153, size:2, speed: 0.5},
		{x: 1900, y: 153, size:2, speed: 0.5}        

        
		
	];

    
    mountains=[-190,650,1450,1530];
    
    birds=[50,710,1270,1600];
    
 canyons = [ //creates the canyons array xpos and width.
        {xpos:-1200, width : 90 },
        {xpos:0, width : 95 },
        {xpos:500, width : 95},
        {xpos:1000, width : 95},
        {xpos:-4000, width : 95},
        {xpos:1300, width : 95},
        {xpos:1500, width : 95}
 

    ];
    
    
    
    collectables = [ //creats the collectables array xpos, ypos , size and isfound
      
       
        {x_pos : -110, y_pos : 390, size : 60,isFound:false},
        {x_pos : -290, y_pos : 390, size : 60,isFound:false},
        {x_pos : 480, y_pos : 390, size : 60,isFound:false},
        {x_pos : 700, y_pos : 395, size : 60,isFound:false},
        {x_pos : 990, y_pos : 400, size : 60,isFound:false},
        {x_pos : 1200, y_pos : 395, size : 60,isFound:false},
        {x_pos : 1450, y_pos : 395, size : 60,isFound:false},
        {x_pos : 1690, y_pos : 400, size : 60,isFound:false},
        {x_pos : 1740, y_pos : 400, size : 60,isFound:false}


    ];
    
    game_score=0;
   
    flagpole={
        x_pos:1920,//x position of flagpole
        isReached:false
        
             }
   
    lives -=1;//lives goes down by -1
    
    //Platforms
    
    platforms =[];
    platforms.push(createPlatform(500,floorPos_y-90,50));
    platforms.push(createPlatform(602,floorPos_y-112,70));
    platforms.push(createPlatform(1105,floorPos_y-100,70));
    platforms.push(createPlatform(1360,floorPos_y-105,60));
    platforms.push(createPlatform(1460,floorPos_y-90,65));
    

    
    //Enemies
    enemies=[];
    enemies.push(new Enemy(-1088,floorPos_y,150));
    enemies.push(new Enemy(-1162,floorPos_y,150));
    enemies.push(new Enemy(-1260,floorPos_y,150));
    enemies.push(new Enemy(-1374,floorPos_y,150));
    
    enemies.push(new Enemy(198,floorPos_y,150));
    enemies.push(new Enemy(1057,floorPos_y,150));
    enemies.push(new Enemy(1394,floorPos_y,150));
    enemies.push(new Enemy(1640,floorPos_y,150));



    star = {
        positions: [],
        starSpeed: []
    };
    
    voidzone = 80; //global layer
    blowFire = []; //fireworks
    
    //initialize machanism
    scrollPos = 0; //control the background scrolling
    


    //fill firework
    for (var i = 0; i < 500; i++) {
        blowFire.push({
            starx: flagpole.x_pos,
            stary: height / 3 - 100,
            speedX: random(4, -4),
            speedY: random(-11, 11),
            color: color(random(5, 255), random(5, 255), random(5, 255)),
            size: random(15, 70)
        });
    }

    
}

function createPlatform(x,y,length)
{
    var p= {
        x: x,
        y: y,
        length: length,
        draw: function()
        {          
            fill(255,244,0);
            rect(this.x, this.y, this.length, 9);
             
        },
       
        checkContact:function(gc_x,gc_y)
        {
            //checks game char is intact with the platform
            if(gc_x>this.x && gc_x<this.x + this.length)
              {
                var d = this.y - gc_y;
                
             if(d>=0 && d<5)
                    {
                        return true;
  
                    }
                
              }
            return false;
         }
    }
    return p;
}
   
//constructor function
function Enemy(x,y,range)
{
    this.x =x;
    this.y =y;
    this.range = range;
    this.current_x =x;
    this.incream =1;
    
    this.draw = function()
    {
        fill(0);
        ellipse(this.current_x, this.y-20,40);
        
        fill(255,4,44);
        stroke(223,2,3);
        strokeWeight(2);
        ellipse(this.current_x-10, this.y-20,10);
        ellipse(this.current_x+10, this.y-20,6);
        
        stroke(128,128,0)
        noFill();
        strokeWeight(1);
        rect(this.current_x-4,this.y-9,9,3);
        
        stroke(222,0,160);
        strokeWeight(3);
        line(
        this.current_x+9, this.y-7, this.current_x-9, this.y-30

        );
        line(
        this.current_x-9, this.y-5, this.current_x+9, this.y-30
        
        );
        noStroke();

    }
    
    this.update = function()
    {
        this.current_x +=this.incream;
        
        if(this.current_x<this.x)
            {
                this.incream =1;
            }
        else if(this.current_x>this.x+this.range)
           {
            this.incream -=1;
           }
    }
    
    this.isContact=function(gc_x,gc_y)
    {
        var d=dist(gc_x, gc_y, this.current_x, this.y);
        
        if(d<25)
            { //enem.play();
                startGame();
                return true;
            }
        return false;
    }
}



//4.3 draw end point firework
function ashHere() {
    for (var i = 0; i < 500; i++) {
        noStroke();
        fill(blowFire[i].color, 230);
        ellipse(
            blowFire[i].starx,
            blowFire[i].stary,
            blowFire[i].size,
            blowFire[i].size
        );
        blowFire[i].size = max(blowFire[i].size - 1.5, 0.01); //prevent size go negative
        blowFire[i].starx += blowFire[i].speedX * PI;
        blowFire[i].stary += blowFire[i].speedY * PI;
        //repeat fireworks
        if (
            (blowFire[i].stary > height || blowFire[i].stary <= 0) &&
            frameCount / 100 == parseInt(frameCount / 100)
        ) {
            blowFire[i].size = 50;
            blowFire[i].starx = flagpole.x_pos + width / 2 - 90;
            blowFire[i].stary = stary = height / 2 - 150;
        }
    }
}

     

//snow
function snowTime()
{      
        fill(255);
        // initialize coordinates
        this.x = 0;
        this.y= random(-90, 10);
        this.angles = random(-77,5);
        this.size = random(3, 10);

        // radius of snowTime 
        // spreading out snow
        this.radius = sqrt(random(pow(width, 2)));

        this.update = function(time) {
        var forces = 0.1; // angle speed
        var sides = forces + this.angles;
        this.x = width+this.radius * sides/3;

        // different size snow fall at slightly different speed
        this.y += pow(this.size, 0.5);

        // remove snow from end of screen
        if (this.y > floorPos_y)
        {
          var index = snowTimes.splice(index, 3);
        }
        };

        this.display = function() {
        ellipse(this.x, this.y, this.size);
      };
}


///emitter function

function Particle(x,y,xSpeed,ySpeed,size,colour)
{
    this.x =x;
    this.y=y;
    this.xSpeed=xSpeed;
    this.ySpeed=ySpeed;
    this.size=size;
    this.colour=colour;
    this.age=0;
    
    this.drawParticle=function()
    {
        fill(this.colour);
        ellipse(this.x, this.y, this.size);
    }
    
    this.updateParticle=function()
    {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
        this.age++;
    }
}

function emitter(x, y, xSpeed, ySpeed, size, colour)
{
    this.x =x;
    this.y=y;
    this.xSpeed=xSpeed;
    this.ySpeed=ySpeed;
    this.size=size;
    this.colour=colour;
    
    this.startParticles=0;
    this.lifetime=0;
    
    this.particles=[];
    this.addParticle= function()
    {
        var p=new Particle(random(this.x-9, this.x+9),
                                   random(this.y-10, this.y+10), 
                                   random(this.xSpeed-1, this.xSpeed+1), 
                                   random(this.ySpeed-1, this.ySpeed+1),
                                   random(this.size-4, this.size+4), 
                                   this.colour);
                return p;
    }
    
    this.startEmitter=function(startParticles, lifetime)
    {
        this.startParticles=startParticles;
        this.lifetime=lifetime;
        
        //start emitter with initial particles
        for(var a=0;a<startParticles;a++)
            {
               
                this.particles.push(this.addParticle());
            }
    }
    
    
    this.updateParticles = function()
    {
        //iterate through particles and draw to the UI
        var deadParticles=0;
        for(var a= this.particles.length-1; a>=0; a--)
            {
                this.particles[a].drawParticle();
                this.particles[a].updateParticle();
                
                if(this.particles[a].age>random(0, this.lifetime))
                {
                    this.particles.splice(a,1);   
                    deadParticles++;
                }
            }
        if(deadParticles>0)
            {
               for(var a=0;a<deadParticles;a++)
                   {
                       this.particles.push(this.addParticle());

                   }
            }
    }
}





















