let sheepX = 170;       
let sheepY = 320;       
let sheepStartX = 170;   

let sheepVelocityX = 0; 
let sheepVelocityY = 0; 
let gravity = 0.6;      

let isMoving = false;
let score = 0;

// Reset Button Dimensions
let buttonX, buttonY, buttonW, buttonH;

// Star arrays
let starX = [];
let starY = [];
let starBaseSize = []; 
let starColors = [];
let numStars = 25; 

// Sound Variables
let nightAmbient;
let baaSound;

function preload() {
  // Sound formats p5 should look for
  soundFormats('mp3', 'wav');
  
  // Load your exact file names from Pixabay!
  nightAmbient = loadSound('nightskysounds.mp3');
  baaSound = loadSound('baaa.mp3');
}

function setup() {
  createCanvas(600, 500); 
  
  // Set up button size and position
  buttonW = 100;
  buttonH = 40;
  buttonX = width / 2 - buttonW / 2;
  buttonY = 420;
  
  // Generate background stars
  for (let i = 0; i < numStars; i++) {
    starX.push(random(0, width));
    starY.push(random(10, 180)); 
    starBaseSize.push(random(1.5, 3.5)); 
    starColors.push(random(["#ffffff", "#fefae0", "#faedcd", "#e0e1dd"]));
  }
  
  // Start the peaceful night sounds looping softly in the background
  nightAmbient.loop();
  nightAmbient.setVolume(0.20); // Kept quiet and ambient
}

function draw() {
  background("#0d1117"); 
  
  // 1. DRAW THE STARS
  push();
  noStroke();
  for (let i = 0; i < numStars; i++) {
    fill(starColors[i]);
    let shimmer = sin(frameCount * 0.05 + i) * 0.8; 
    let finalSize = max(0.5, starBaseSize[i] + shimmer);
    ellipse(starX[i], starY[i], finalSize, finalSize);
  }
  pop();
  
  // 2. DRAW THE COZY MOON
  push();
  noStroke();
  fill("#f0e6d2");
  ellipse(500, 80, 50, 50);
  fill("#0d1117");
  ellipse(512, 75, 45, 45);
  pop();
  
  // 3. GAME PHYSICS
  if (isMoving) {
    sheepX += sheepVelocityX; 
    sheepY += sheepVelocityY; 
    sheepVelocityY += gravity; 
    
    if (sheepY >= 320) {
      sheepY = 320;
      sheepVelocityY = 0; 
    }
    
    if (sheepX > width + 50) {
      score++;
      resetSheep();
    }
  }

  // 4. DRAW SCORE TRACKER
  fill("#ffffff");
  textAlign(CENTER, CENTER);
  textSize(80);
  text(score, width / 2, 120);

  // 5. DRAW ENVIRONMENT
  stroke("#21262d");
  strokeWeight(3);
  line(0, 350, width, 350); 
  
  drawFence(width / 2, 350); 
  
  // 6. DRAW CHARACTER
  drawProceduralSheep(sheepX, sheepY);
  
  // 7. DRAW COZY RESET BUTTON
  drawResetButton();
}

function drawFence(x, y) {
  push();
  translate(x, y);
  fill("#bc6c25"); 
  noStroke();
  rect(-25, -50, 10, 50, 2); 
  rect(15, -50, 10, 50, 2);  
  rect(-40, -42, 80, 10, 1); 
  rect(-40, -24, 80, 10, 1); 
  pop();
}

function drawProceduralSheep(x, y) {
  push();
  translate(x, y);
  
  let breathPulse = 0;
  let frontLegOffset = 0;
  let backLegOffset = 0;
  let jumpTwitch = 0; 
  
  if (sheepX === sheepStartX) {
    breathPulse = sin(frameCount * 0.04) * 25; 
  } else {
    frontLegOffset = sin(frameCount * 0.3) * 10;
    backLegOffset = cos(frameCount * 0.3) * 10;
    
    // Ear flick logic on upward momentum
    if (sheepVelocityY < 0) {
      jumpTwitch = sheepVelocityY * 4; 
    }
  }
  
  let earWiggle = cos(frameCount * 0.02) * 3; 
  let jumpStretch = sheepVelocityY * 1.5;

  // Legs 
  stroke("#1f242c");
  strokeWeight(6);
  line(-25, 0, -25, 30 + backLegOffset);
  line(25, 0, 25, 30 + backLegOffset);
  line(-10, 0, -10, 30 + frontLegOffset);
  line(10, 0, 10, 30 + frontLegOffset);

  // Fluffy Coat
  noStroke();
  fill("#f0f6fc");
  ellipse(0, -10, 90 + breathPulse - jumpStretch, 65 + breathPulse + jumpStretch); 
  ellipse(-25, -20, 45, 40);  
  ellipse(30, -15, 50, 45);   
  ellipse(0, -35, 55, 35);   
  
  // Head & Face
  fill("#d0d7de");
  ellipse(45, -20, 35, 28);
  
  // Sleeping Eye
  stroke("#57606a");
  strokeWeight(2);
  noFill();
  arc(52, -22, 6, 6, 0, PI); 

  // Ear with the take-off twitch
  noStroke();
  fill("#c9d1d9");
  push();
  translate(35, -25);
  rotate(radians(-45 + earWiggle + jumpTwitch)); 
  ellipse(0, 0, 10, 20);
  pop();

  pop();
}

function drawResetButton() {
  push();
  if (mouseX >= buttonX && mouseX <= buttonX + buttonW && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    fill("#21262d");
  } else {
    fill("#161b22"); 
  }
  
  stroke("#30363d");
  strokeWeight(1.5);
  rect(buttonX, buttonY, buttonW, buttonH, 20); 
  
  noStroke();
  fill("#8b949e"); 
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Reset", buttonX + buttonW / 2, buttonY + buttonH / 2);
  pop();
}

function mousePressed() {
  if (mouseX >= buttonX && mouseX <= buttonX + buttonW && mouseY >= buttonY && mouseY <= buttonY + buttonH) {
    score = 0; 
    resetSheep(); 
  }
}

function keyPressed() {
  if (key === ' ' && !isMoving) {
    isMoving = true;
    sheepVelocityX = 5;    
    sheepVelocityY = -13;  
    
    // FIX: Play from 0 seconds and cut off after 0.8 seconds to stop the double-baa!
    // If it still cuts off too early or late, you can tweak that last 0.8 number.
    baaSound.play(0, 1, 0.3, 0, 0.8);
  }
}

function resetSheep() {
  sheepX = sheepStartX;
  sheepY = 320;
  sheepVelocityX = 0;
  sheepVelocityY = 0;
  isMoving = false;
}
