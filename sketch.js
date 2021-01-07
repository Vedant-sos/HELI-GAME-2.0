//Create all the variables
var helicopter,helicopterimg;
var skyimg;
var missile,missileimg;
var gun,gunimg;
var score,highscore;
var gameState;
var gunGroup,missileGroup;
var explosion;
var collect;

function preload(){
  //Load the images
  helicopterimg=loadImage("helicopter.png");
  skyimg=loadImage("sky.jpg");
  missileimg=loadImage("missile.png");
  gunimg=loadImage("gun.png");
  //Load the sounds
  explosion=loadSound("Explosion+7.mp3");
  collect=loadSound("gunreload.mp3");
}

function setup(){
  createCanvas(displayWidth,displayHeight);

  //Create the sky as the background
  sky=createSprite(displayWidth/2,displayHeight/2,50,50);
  sky.addImage(skyimg);
  sky.scale=4;
  
  //Create the main sprite-helicopter
  helicopter=createSprite(200,200,20,20);
  helicopter.addImage(helicopterimg);
  helicopter.scale=0.7;
  //helicopter.debug=true;

  //Create groups for missile and gun due to continuous spawning
  missileGroup=new Group();
  gunGroup=new Group();  

  //Initialise the gamestate, score and the highest score
  gameState=1;
  score=0;
  highscore=0;
}


function draw(){
  background("white");
  //console.log(helicopter.x);
  if(gameState===1){
  //Make the sky move such that the sprite object movements are illusioned  
  sky.velocityX=-5;
  //Focus the camera on helicopter
  camera.position.x=helicopter.x;
  //Ensure the background does not move out of canvas
  if(sky.x<100){
    sky.x=displayWidth/2;
  }
  
  //Assign helicopter movements
  if(keyWentDown(DOWN_ARROW) && score>=0 && score<25){
    helicopter.y=helicopter.y+25;
  } 
  //Reverse the movements midway
  if(keyWentDown(DOWN_ARROW) && score>=25 && score<50){
    helicopter.y=helicopter.y-25;
  }
  if(keyWentDown(DOWN_ARROW) && score>=50){
    helicopter.y=helicopter.y+25;
  }
  
  if(keyWentDown(UP_ARROW) && score>=0 && score<25){
    helicopter.y=helicopter.y-25;
  }
  if(keyWentDown(UP_ARROW) && score>=25 && score<50){
    helicopter.y=helicopter.y+25
  }
  if(keyWentDown(UP_ARROW) && score>=50){
    helicopter.y=helicopter.y-25
  }

  //Spawn the missiles
  if((sky.x <=200 && sky.x>=195) || (sky.x<=500 && sky.x>=495)){
    missile=createSprite(displayWidth,random(70,displayHeight-50),30,30);
    missile.addImage(missileimg);
    missile.scale=0.3;
    missile.velocityX=-15;
    if(score>20){
      missile.velocityX=-18;
    }
    if(score>40){
      missile.velocityX=-21;
    }
    //missile.debug=true;
    missile.lifetime=200;
    missileGroup.add(missile);
    }
  //Spawn the guns  
  if(sky.x>=675 || (sky.x<=180 && sky.x>=175)){
    gun=createSprite(displayWidth,random(70,displayHeight-50),20,20);
    gun.addImage(gunimg);
    gun.scale=0.1;
    gun.velocityX=-8;
    gun.lifetime=200;
    gunGroup.add(gun);
    //gun.debug=true;
  }
  //Update the score when the helicopter touches the targets
  if(gunGroup.isTouching(helicopter)){
    score=score+5;
    //Play the correct sound
    collect.play();
    //Remove the guns 
    gunGroup.destroyEach();
  }
  //Game finishes when obstacle touches main sprite
  if(missileGroup.isTouching(helicopter)){
    //Change gameState to end
    gameState=0;
    //All sprites should be made invisible
    gunGroup.setVisibleEach(false);
    missileGroup.setVisibleEach(false);
    helicopter.visible=false;
    //Play sound
    explosion.play();
  }

  
}
//Check if currect score is the highest score
if(score>highscore){
  highscore=score;
}
  //Display sprites
  drawSprites();

  //Instructions for the game
  textSize(20);
  fill("red");
  text("CATCH THE GUNS AVOID THE MISSILES!",-100,50);
  //Display score and highest score
  fill(rgb(150,100,200));
  text("AMMO SCORE: "+ score,350,50);
  fill("yellow");
  textSize(20);
  text("HIGH SCORE: "+ highscore,550,50);

  if(gameState===0){
    //Background should stop moving
    sky.velocityX=0;
    //Set sprite lifetime to -1
    missileGroup.setLifetimeEach(-1);
    gunGroup.setLifetimeEach(-1);
    helicopter.lifetime=-1
    textSize(20);
    fill("green");
    text("YOU SCORED "+score,150,300);
    text("PRESS SPACE TO PLAY AGAIN",100,400);
    //Game must restart when space key is pressed
    if(keyCode===32){
      gameState=1;
      //Score must be initialised to 0 for restart 
      score=0;
      gunGroup.destroyEach();
      missileGroup.destroyEach();
      //Helicopter should be made visible again
      helicopter.visible=true;
    }
  }

}





