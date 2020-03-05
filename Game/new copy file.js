/*

The Game Project 7 – Make it awesome

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var platforms;

var flagpole;
var game_score;
var lives;


function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    
    lives = 4;
    
    startGame();
}


function startGame()
{
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
    clouds = [
        {x_pos: width/2 + 210, 
         y_pos: random(floorPos_y - 30, floorPos_y + 130), 
         width: random(100, 300)
        }, 
        {x_pos: width/2 + 600, 
         y_pos: random(floorPos_y - 30, floorPos_y + 130), 
         width: random(100, 300)
        }, 
        {x_pos: width/2 + 1000, 
         y_pos: random(floorPos_y - 30, floorPos_y + 130),
         width: random(100, 300)
        },
        {x_pos: width/2 + 1400, 
         y_pos: random(floorPos_y - 30, floorPos_y + 130),
         width: random(100, 300)
        },
        {x_pos: width/2 + 1900, 
         y_pos: random(floorPos_y - 30, floorPos_y + 130),
         width: random(100, 300)
        }
    ];
    
    mountains = [
        {x_pos: width/2 + 300, 
         width: random(200, 1000)
        },
        {x_pos: width/2 + 1000, 
         width: random(200, 1000)
        },
        {x_pos: width/2 + 1600, 
         width: random(200, 1000)
        }
    ];
    
    trees_x = [width/2 + 100, width/2 + 352, width/2 + 488, width/2 + 852, width/2 + 1024, width/2 + 1700];
    
    canyons = [
        {x_pos: width/2 + 150, 
         width: random(80, 120)
        },
        {x_pos: width/2 + 1000, 
         width: random(80, 120)
        },
        {x_pos: width/2 + 1900, 
         width: random(80, 120)
        },
    ];
    
    collectables = [
        {x_pos: width/2 + 450, 
         y_pos: floorPos_y - 90,
         size: 35,
         isFound: false
        },
        {x_pos: width/2 + 730, 
         y_pos: floorPos_y - 115,
         size: 35,
         isFound: false
        },
        {x_pos: width/2 + 900, 
         y_pos: floorPos_y - 25, 
         size: 35,
         isFound: false
        },
        {x_pos: width/2 + 1250, 
         y_pos: floorPos_y - 90, 
         size: 35,
         isFound: false
        },
        {x_pos: width/2 + 1450, 
         y_pos: floorPos_y - 115, 
         size: 35,
         isFound: false
        },
        {x_pos: width/2 + 1650, 
         y_pos: floorPos_y - 130, 
         size: 35,
         isFound: false
        },
        {x_pos: width/2 + 1900, 
         y_pos: floorPos_y - 60, 
         size: 35,
         isFound: false
        }
    ];
    
    // Initialise platforms.
    platforms = [];
    
    platforms.push(createPlatform(width/2 + 400, floorPos_y - 75, 100));
    platforms.push(createPlatform(width/2 + 600, floorPos_y - 100, 100));
    platforms.push(createPlatform(width/2 + 1200, floorPos_y - 75, 100));
    platforms.push(createPlatform(width/2 + 1400, floorPos_y - 100, 100));
    platforms.push(createPlatform(width/2 + 1600, floorPos_y - 125, 100));
    
    // Initialise game rules.
    flagpole = {
        x_pos: width/2 + 2300,
        isReached: false
    };  
    
    game_score = 0;
    
    lives -= 1;
}


function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    
    // Implement scrolling.
    push();
    translate(scrollPos,0);

	// Draw clouds.
    drawClouds();
    
	// Draw mountains.
    drawMountains();
    
	// Draw trees.
    drawTrees();
    
	// Draw canyons.
    for(var i = 0; i < canyons.length; i++){
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    
	// Draw collectable items.
    for(var i = 0; i < collectables.length; i++){
        if(!collectables[i].isFound){
            drawCollectable(collectables[i]); 
            checkCollectable(collectables[i]);
        }    
    }
    
    // Draw flagpole.
    renderFlagpole();
    
    // Draw platforms.
    for(var i = 0; i < platforms.length; i++){
        platforms[i].draw();
    }
    
    // Implement scrolling.
    pop();
   
	// Draw game character.
	drawGameChar();
    
    // Draw score & life.
    drawScore();
    drawTokens();
    
    // Draw game over text.
    if(lives < 1){
        fill(0, 150);
        rect(0, 0, 1024, 576);
        
        fill(255);
        noStroke;
        textSize(36);
        textAlign(CENTER);
        text("Game over. Press space to continue.", width/2, height/2);
        
        return;
    }
    else if(flagpole.isReached){
        fill(100, 155, 255);
        rect(0, 0, 300, 80);
        fill(255, 150);
        rect(0, 0, 1024, 576);
        
        fill(0);
        noStroke;
        textSize(36);
        textAlign(CENTER);
        text("Level complete. Press space to continue.", width/2, height/2);
        
        return;
    }

	// Logic to make the game character move or the background scroll.
	if(isLeft){
		if(gameChar_x > width * 0.2){
			gameChar_x -= 5;
		}
		else{
			scrollPos += 5;
		}
	}

	if(isRight){
		if(gameChar_x < width * 0.8){
			gameChar_x  += 5;
		}
		else{
			scrollPos -= 5; 
		}
	}

	// Logic to make the game character rise and fall or handle platforms.
    if(gameChar_y < floorPos_y){
        var isContact = false;
        for(var i = 0; i < platforms.length; i++){
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y)){
                isContact = true;
                break;
            }
        }
        
        if(!isContact){
            gameChar_y += 2; 
            isFalling = true;
        }
        else{
            isFalling = false;
        }
    }
    else{
        isFalling = false;
    }
    
    // Logic to make the game character plummet.
    if(isPlummeting){
        isRight = false;
        isLeft = false;
        gameChar_y += 5;
    }
    
    // Logic to trigger flagpole.
    if(!flagpole.isReached){
        checkFlagpole();
    }
    
    // Logic to restart life.
    if(gameChar_y > height && lives > 0){
        startGame();
    }

	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos; 
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{
    if(flagpole.isReached && key == ' '){
        nextLevel();
        return;
    }
    else if(lives == 0 && key == ' '){
        returnToStart();
        return;
    }
    
	if(keyCode == 37){
        isLeft = true;
    }
    
    if(keyCode == 39){
        isRight = true;
    }
    
    for(var i = 0; i < platforms.length; i++){
        if((keyCode == 32 && gameChar_y == floorPos_y) || (keyCode == 32 && platforms[i].checkContact(gameChar_world_x, gameChar_y))){
            isFalling = true;
            gameChar_y -= 100;
        }
    }
}

function keyReleased()
{
	if(keyCode == 37){
        isLeft = false;
    }
    
    if(keyCode == 39){
        isRight = false;
    }
    
    if(keyCode == 32){
        isFalling = false;
    }
}


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.
function drawGameChar()
{
	// draw game character
    
    if(isLeft && isFalling){
		// add your jumping-left code
        
        ////body
        fill(193, 172, 169);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            0, PI, OPEN
        ); 

        push();
        fill(233, 230, 235);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            0, PI/2, OPEN
        );
        pop();

        ////head
        arc(
            gameChar_x - 13,
            gameChar_y - 26,
            14, 46,
            PI, 2*PI, OPEN
        );

        ////beak
        fill(124, 120, 134);
        arc(
            gameChar_x - 18,
            gameChar_y - 40,
            10, 6,
            PI, 3*PI/2
        );

        fill(56, 56, 58);
        arc(
            gameChar_x - 18,
            gameChar_y - 41,
            9, 4,
            PI/2, PI
        );

        ////eyes
        push();
        fill(233, 230, 235);
        ellipse(
            gameChar_x - 14,
            gameChar_y - 43,
            5, 5
        );
        pop();

        ellipse(
            gameChar_x - 14,
            gameChar_y - 43,
            3, 3
        );

        ////wing
        fill(151, 118, 101);
        arc(
            gameChar_x + 7,
            gameChar_y - 26,
            26, 34,
            0, PI, OPEN
        );

        fill(114, 94, 85);
        arc(
            gameChar_x + 7,
            gameChar_y - 40,
            26, 34,
            0, 3*PI/4, OPEN
        );
	}
    
	else if(isRight && isFalling){
		// add your jumping-right code
        
        ////body
        fill(193, 172, 169);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            0, PI, OPEN
        ); 

        push();
        fill(233, 230, 235);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            PI/2, PI, OPEN
        );
        pop();

        ////head
        arc(
            gameChar_x + 13,
            gameChar_y - 26,
            14, 46,
            PI, 2*PI, OPEN
        );

        ////beak
        fill(124, 120, 134);
        arc(
            gameChar_x + 18,
            gameChar_y - 40,
            10, 6,
            3*PI/2, 2*PI
        );

        fill(56, 56, 58);
        arc(
            gameChar_x+18,
            gameChar_y-41,
            9,4,
            0, PI/2
        );

        ////eyes
        push();
        fill(233, 230, 235);
        ellipse(
            gameChar_x + 14,
            gameChar_y - 43,
            5, 5
        );
        pop();

        ellipse(
            gameChar_x + 14,
            gameChar_y - 43,
            3, 3
        );

        ////wing
        fill(151, 118, 101);
        arc(
            gameChar_x - 7,
            gameChar_y - 26,
            26, 34,
            0, PI, OPEN
        );

        fill(114, 94, 85);
        arc(
            gameChar_x - 7,
            gameChar_y - 40,
            26, 34,
            PI/4, PI, OPEN
        );
	}
    
	else if(isLeft){
		// add your walking left code
        
        ////body
        fill(193, 172, 169);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            0, PI, OPEN
        ); 

        push();
        fill(233, 230, 235);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            0, PI/2, OPEN
        );
        pop();

        ////head
        arc(
            gameChar_x - 13,
            gameChar_y - 26, 
            14, 46,
            PI, 2*PI, OPEN
        );

        ////beak
        fill(124, 120, 134);
        arc(
            gameChar_x - 18,
            gameChar_y - 40,
            10, 6,
            PI, 3*PI/2
        );

        fill(56, 56, 58);
        arc(
            gameChar_x - 18,
            gameChar_y - 41,
            9, 4,
            PI/2, PI
        );

        ////eyes
        push();
        fill(233, 230, 235);
        ellipse(
            gameChar_x - 14,
            gameChar_y - 43,
            5, 5
        );
        pop();

        ellipse(
            gameChar_x - 14,
            gameChar_y - 43,
            3, 3
        );

        ////wing
        fill(151, 118, 101);
        arc(
            gameChar_x + 7,
            gameChar_y - 26,
            26, 34,
            0, PI, OPEN
        );

        fill(114, 94, 85);
        arc(
            gameChar_x + 7,
            gameChar_y - 26,
            26, 34,
            0, 3*PI/4, OPEN
        );

        ////feet
        fill(194, 98, 56);
        arc(
            gameChar_x - 2,
            gameChar_y,
            3, 6,
            0, PI
        );

        arc(
            gameChar_x + 1,
            gameChar_y,
            3, 6,
            0, PI
        );
	}
    
	else if(isRight){
		// add your walking right code
        
        ////body
        fill(193, 172, 169);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            0, PI, OPEN
        ); 

        push();
        fill(233, 230, 235);
        arc(
            gameChar_x,
            gameChar_y - 26,
            40, 54,
            PI/2, PI, OPEN
        );
        pop();

        ////head
        arc(
            gameChar_x + 13,
            gameChar_y - 26,
            14, 46,
            PI, 2*PI, OPEN
        );

        ////beak
        fill(124, 120, 134);
        arc(
            gameChar_x + 18,
            gameChar_y - 40,
            10, 6,
            3*PI/2, 2*PI
        );

        fill(56, 56, 58);
        arc(
            gameChar_x + 18,
            gameChar_y - 41,
            9, 4,
            0, PI/2
        );

        ////eyes
        push();
        fill(233, 230, 235);
        ellipse(
            gameChar_x + 14,
            gameChar_y - 43,
            5, 5
        );
        pop();

        ellipse(
            gameChar_x + 14,
            gameChar_y - 43,
            3, 3
        );

        ////wing
        fill(151, 118, 101);
        arc(
            gameChar_x - 7,
            gameChar_y - 26,
            26, 34,
            0, PI, OPEN
        );

        fill(114, 94, 85);
        arc(
            gameChar_x - 7,
            gameChar_y - 26,
            26, 34,
            PI/4, PI, OPEN
        );

        ////feet
        fill(194, 98, 56);
        arc(
            gameChar_x - 2,
            gameChar_y,
            3, 6,
            0, PI
        );

        arc(
            gameChar_x + 1,
            gameChar_y,
            3, 6,
            0, PI
        );
	}
    
	else if(isFalling || isPlummeting){
		// add your jumping facing forwards code
        
        ////body
        fill(193, 172, 169);
        arc(
            gameChar_x,
            gameChar_y - 26,
            30, 54,
            0, PI, OPEN
        ); 

        push();
        fill(233, 230, 235);
        arc(
            gameChar_x,
            gameChar_y - 26,
            30, 30,
            PI, 2*PI, OPEN
        );
        pop();

        ////head
        arc(
            gameChar_x,
            gameChar_y - 26,
            14, 46,
            PI, 2*PI, OPEN
        );

        ////beak
        fill(124, 120, 134);
        arc(
            gameChar_x + 3,
            gameChar_y - 40,
            10, 6,
            3*PI/2, 2*PI
        );

        fill(56, 56, 58);
        arc(
            gameChar_x + 3,
            gameChar_y - 41,
            9, 4,
            0, PI/2
        );

        ////eye
        push();
        fill(233, 230, 235);
        ellipse(
            gameChar_x,
            gameChar_y - 43,
            5, 5
        );
        pop();

        ellipse(
            gameChar_x,
            gameChar_y - 43,
            3, 3
        );

        ////wing
        fill(151, 118, 101);
        arc(
            gameChar_x + 7,
            gameChar_y - 26,
            33, 8,
            3*PI/2, 5*PI/2, OPEN
           );

        arc(
            gameChar_x - 7,
            gameChar_y - 26,
            33, 8,
            PI/2, 3*PI/2, OPEN
        );

        fill(114, 94, 85);
        arc(
            gameChar_x + 7,
            gameChar_y - 26,
            33, 8,
            3*PI/2, 9*PI/4, OPEN
        );

        arc(
            gameChar_x - 7,
            gameChar_y - 26,
            33, 8,
            3*PI/4, 3*PI/2, OPEN
        );
	}
    
	else{   
        //add your standing front facing code
        
        ////body
        fill(193, 172, 169);
        arc(
            gameChar_x,
            gameChar_y - 26,
            30, 54,
            0, PI, OPEN
        ); 

        push();
        fill(233, 230, 235);
        arc(
            gameChar_x,
            gameChar_y - 26,
            30, 30,
            PI, 2*PI, OPEN
        );
        pop();

        ////head
        arc(
            gameChar_x,
            gameChar_y - 26,
            14, 46,
            PI, 2*PI, OPEN
        );

        ////beak
        fill(124, 120, 134);
        arc(
            gameChar_x + 3,
            gameChar_y - 40,
            10, 6,
            3*PI/2, 2*PI
        );

        fill(56, 56, 58);
        arc(gameChar_x + 3,
            gameChar_y - 41,
            9, 4,
            0, PI/2
        );

        ////eye
        push();
        fill(233 ,230, 235);
        ellipse(
            gameChar_x,
            gameChar_y - 43,
            5, 5
        );
        pop();

        ellipse(
            gameChar_x,
            gameChar_y - 43,
            3, 3
        );

        ////wing
        fill(151, 118, 101);
        arc(
            gameChar_x + 11,
            gameChar_y - 26,
            8, 33,
            0, PI, OPEN
        );

        arc(
            gameChar_x - 11,
            gameChar_y - 26,
            8, 33,
            0, PI, OPEN
        );

        fill(114, 94, 85);
        arc(
            gameChar_x + 11,
            gameChar_y - 26,
            8, 33,
            0, 3*PI/4, OPEN
        );

        arc(
            gameChar_x - 11,
            gameChar_y - 26,
            8, 33,
            PI/4, PI, OPEN
        );
        pop();

        ////feet
        fill(194, 98, 56);
        arc(gameChar_x - 2,
            gameChar_y,
            3, 6,
            0, PI
        );

        arc(
            gameChar_x + 1,
            gameChar_y,
            3, 6,
            0, PI
        );
	}
}


// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds()
{
    for(var i = 0; i < clouds.length; i++){
    
        fill(255);

        ////left fluff
        arc(
            clouds[i].x_pos - (6/22)*clouds[i].width, 
            clouds[i].y_pos - 262, 
            (10/22)*clouds[i].width, 
            30, 
            PI, 2*PI
        );

        ////middle fluff
        arc(
            clouds[i].x_pos, 
            clouds[i].y_pos - 262, 
            (12/22)*clouds[i].width, 
            100, 
            PI, 2*PI);

        fill(240);

        ////left fluff shadow
        arc(
            clouds[i].x_pos - (6/22)*clouds[i].width, 
            clouds[i].y_pos - 262, 
            (10/22)*clouds[i].width, 
            20, 
            PI, 2*PI
        );

        ////middle fluff shadow
        arc(
            clouds[i].x_pos, 
            clouds[i].y_pos - 262, 
            (12/22)*clouds[i].width, 
            70, 
            PI, 2*PI
        );

        ////right fluff
        fill(255);
        arc(
            clouds[i].x_pos + (6/22)*clouds[i].width, 
            clouds[i].y_pos - 262, 
            (10/22)*clouds[i].width, 
            55, 
            PI, 2*PI
        );

        ////right fluff shadow
        fill(240);
        arc(
            clouds[i].x_pos + (7/22)*clouds[i].width, 
            clouds[i].y_pos - 262, 
            (8/22)*clouds[i].width, 
            40, 
            PI, 2*PI
        );

        ////cloud shadow
        fill(135, 206, 250, 80);
        quad(
            clouds[i].x_pos - clouds[i].width/2, 
            clouds[i].y_pos - 262, 
            clouds[i].x_pos + clouds[i].width/2, 
            clouds[i].y_pos - 262, 
            clouds[i].x_pos + clouds[i].width/2 - (8/22)*clouds[i].width, 
            floorPos_y, 
            clouds[i].x_pos - clouds[i].width/2 - (8/22)*clouds[i].width, 
            floorPos_y
        );
    }
}

// Function to draw mountains objects.
function drawMountains()
{
    for(var i = 0; i < mountains.length; i++){
        
        ////small mountain
        fill(154, 205, 50);
        triangle(
            mountains[i].x_pos - (5/74)*mountains[i].width, 
            //would be nice to use array to do these ratios
            floorPos_y, 
            mountains[i].x_pos - (10/74)*mountains[i].width, 
            floorPos_y - 52, 
            mountains[i].x_pos - (1/74)*mountains[i].width, 
            floorPos_y - 32
        );

        fill(0, 140, 0);
        triangle(
            mountains[i].x_pos - (21/74)*mountains[i].width, 
            floorPos_y, 
            mountains[i].x_pos - (10/74)*mountains[i].width, 
            floorPos_y - 52, 
            mountains[i].x_pos - (5/74)*mountains[i].width, 
            floorPos_y
        );

        ////big mountain
        triangle(
            mountains[i].x_pos - (16/74)*mountains[i].width, 
            floorPos_y, 
            mountains[i].x_pos + (6/74)*mountains[i].width, 
            floorPos_y - 92, 
            mountains[i].x_pos + (19/74)*mountains[i].width, 
            floorPos_y
        );

        fill(154, 205, 50);
        triangle(
            mountains[i].x_pos + (19/74)*mountains[i].width, 
            floorPos_y, 
            mountains[i].x_pos + (6/74)*mountains[i].width, 
            floorPos_y - 92, 
            mountains[i].x_pos + (34/74)*mountains[i].width, 
            floorPos_y
        );

        ////mountain shadow
        fill(0, 100, 0);
        triangle(
            mountains[i].x_pos - mountains[i].width/2, 
            floorPos_y, 
            mountains[i].x_pos, 
            floorPos_y + 18, 
            mountains[i].x_pos + mountains[i].width/2, 
            floorPos_y
        );
    }
}

// Function to draw trees objects.
function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++){
        
        fill(47, 79, 79);
        
        ////trunk
        quad(
            trees_x[i] + 8, 
            floorPos_y - 32,
            trees_x[i] + 16, 
            floorPos_y - 32, 
            trees_x[i] + 6, 
            floorPos_y, 
            trees_x[i] - 2, 
            floorPos_y
        );
        
        ////branch
        quad(
            trees_x[i] - 28, 
            floorPos_y - 32,
            trees_x[i] - 23, 
            floorPos_y - 32,
            trees_x[i] + 6, 
            floorPos_y,
            trees_x[i] - 2,
            floorPos_y
        );
        
        ////leaves
        fill(0, 120, 0);
        ellipse(
            trees_x[i], 
            floorPos_y - 42, 
            80, 65
        );
        
        ////leaves shadow
        fill(0, 100, 0);
        arc(
            trees_x[i], 
            floorPos_y - 42, 
            80, 65, 
            PI/4, 3*PI/2, OPEN
        );
    }
}

// Function to draw score.
function drawScore()
{
    for(var i = 0; i < lives; i++){
        fill(0);
        noStroke;
        textStyle(BOLD);
        textSize(50);
        text(game_score, 915, 80); 
    }
}

// Function to draw tokens.
function drawTokens()
{
    for(var i = 0; i < lives; i++){
        fill(139, 69, 19);
        rect(0, 78, 240, 10);

        fill(255);
        noStroke;
        textSize(18);



        fill(193, 172, 169);
        arc(
            108 + 45 * i,
            75 - 26,
            30, 54,
            0, PI, OPEN
        ); 

        push();
        fill(233, 230, 235);
        arc(
            108 + 45 * i,
            75 - 26,
            30, 30,
            PI, 2*PI, OPEN
        );
        pop();

        ////head
        arc(
            108 + 45 * i,
            75 - 26,
            14, 46,
            PI, 2*PI, OPEN
        );

        ////beak
        fill(124, 120, 134);
        arc(
            108 + 45 * i + 3,
            75 - 40,
            10, 6,
            3*PI/2, 2*PI
        );

        fill(56, 56, 58);
        arc(108 + 45 * i + 3,
            75 - 41,
            9, 4,
            0, PI/2
        );

        ////eye
        push();
        fill(233 ,230, 235);
        ellipse(
            108 + 45 * i,
            75 - 43,
            5, 5
        );
        pop();

        ellipse(
            108 + 45 * i,
            75 - 43,
            3, 3
        );

        ////wing
        fill(151, 118, 101);
        arc(
            108 + 45 * i + 11,
            75 - 26,
            8, 33,
            0, PI, OPEN
        );

        arc(
            108 + 45 * i - 11,
            75 - 26,
            8, 33,
            0, PI, OPEN
        );

        fill(114, 94, 85);
        arc(
            108 + 45 * i + 11,
            75 - 26,
            8, 33,
            0, 3*PI/4, OPEN
        );

        arc(
            108 + 45 * i - 11,
            75 - 26,
            8, 33,
            PI/4, PI, OPEN
        );
        pop();

        ////feet
        fill(194, 98, 56);
        arc(108 + 45 * i - 2,
            75,
            3, 6,
            0, PI
        );

        arc(
            108 + 45 * i + 1,
            75,
            3, 6,
            0, PI
        );
    }
}
        
        
// ----------------------------------
// Canyon render and check functions
// ----------------------------------

// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    ////main canyon
    fill(165, 42, 42);
    rect(
        t_canyon.x_pos - t_canyon.width/2, 
        floorPos_y, 
        t_canyon.width, 
        144
    );

    ////water
    fill(139, 0, 0);
    triangle(
        t_canyon.x_pos - t_canyon.width/2, 
        floorPos_y + 144, 
        t_canyon.x_pos + t_canyon.width/2, 
        floorPos_y + 58, 
        t_canyon.x_pos + t_canyon.width/2, 
        floorPos_y + 144
    );

    ////canyon sides
    fill(205, 92, 92, 100);
    rect(
        t_canyon.x_pos - t_canyon.width/2, 
        floorPos_y, 
        10, 
        144
    );
    rect(
        t_canyon.x_pos + t_canyon.width/2 - 10, 
        floorPos_y, 
        10, 
        144
    );
}

// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if(gameChar_world_x < t_canyon.x_pos + t_canyon.width/2 - 10 && gameChar_world_x > t_canyon.x_pos - t_canyon.width/2 + 10 && gameChar_y == floorPos_y){
        isPlummeting = true;
    }
}


// ---------------------------------------------
// Collectable items render and check functions
// ---------------------------------------------

// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    ////lemon
    fill(218, 165, 32);
    arc(
        t_collectable.x_pos, 
        t_collectable.y_pos - 22, 
        t_collectable.size, t_collectable.size, 
        0, 5*PI/4, OPEN
    );

    fill(255, 215, 0);
    arc(
        t_collectable.x_pos, 
        t_collectable.y_pos - 22, 
        (6/7)*t_collectable.size, (6/7)*t_collectable.size, 
        0, 5*PI/4, OPEN
    );

    ////slice
    fill(255, 255, 0);
    arc(
        t_collectable.x_pos, 
        t_collectable.y_pos - 22, 
        (5/7)*t_collectable.size, (5/7)*t_collectable.size, 
        0, PI
    );
}

// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    var d = dist(gameChar_world_x, gameChar_y - 13, t_collectable.x_pos, t_collectable.y_pos);
    
    if(d < 20){
        t_collectable.isFound = true;
        game_score += t_collectable.size;
    }
}


// ------------------------------------
// Flagpole render and check functions
// ------------------------------------

// Function to draw flagpole.
function renderFlagpole()
{
    push();
    
    stroke(139, 69, 19);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    
    if(flagpole.isReached){
        noStroke();
        fill(255,255,0);
        rect(flagpole.x_pos, floorPos_y - 200, 50, 50);
        fill(255,215,0);
        triangle(
            flagpole.x_pos, floorPos_y - 150,
            flagpole.x_pos + 50, floorPos_y - 150,
            flagpole.x_pos + 50, floorPos_y - 200
        );
    }
    else{
        noStroke();
        fill(255,255,0);
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
        fill(255,215,0);
        triangle(
            flagpole.x_pos, floorPos_y,
            flagpole.x_pos + 50, floorPos_y,
            flagpole.x_pos + 50, floorPos_y - 50
        );
    }
    
    pop();
}

// Function to check character has reached the flagpole.
function checkFlagpole()
{
    var d = abs(gameChar_world_x - flagpole.x_pos); //abs gives magnitude
    
    if(d < 20){
        flagpole.isReached = true;
    }
}


// -------------------------
// Platform render function
// -------------------------

// Function to draw platform.
function createPlatform(x, y, length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(139, 69, 19);
            rect(this.x, this.y, this.length, 10);
        },
        checkContact: function(gc_x, gc_y)
        {
            // Checks whether game character is in contact with the platform.
            if(gc_x > this.x && gc_x < this.x + this.length + 2){
                var d = this.y - gc_y;
                if(d > -5 && d < 5 ){
                    return true;
                }
            }
            
            return false;
        }
    }
    
    return p;
}