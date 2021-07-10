const c = document.getElementById("canvas").getContext("2d"); //gets the canvas element from .html file and
//sets dimensions to 2d.
let currentLevel; //declares variable to be used later.
let keysDown = {}; //empty object that will be used to hold the current key being pressed.

addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
}); //listens for key pressed and stores information in keysDown variable.
addEventListener("keyup", function(event){
  delete keysDown[event.keyCode];
}); //when key is released, deletes information from keysDown

function input() {
  if(65 in keysDown) {
    if (getTile((player.x - player.speed) + 1, player.y + 16) !== "1") { //If player runs into a wall, they will not be allowed to go through it.
      player.x -= 3; //when "A" is pressed on keyboard, move player 3 pixels to left.
    }
  }
  if(68 in keysDown) {
    if (getTile(((player.x + player.width) + player.speed) - 1, player.y + 16) !== "1") {  //If player runs into a wall, they will not be allowed to go through it.
      player.x += 3; //when "D" is pressed on keyboard, move player 3 pixels to right.
    }
  }
  if(87 in keysDown && player.yke === 0) {
    if(getTile(player.x, player.y -1) !== "1" && getTile(player.x + 32, player.y -1) !== "1") {
      player.yke += 8;
    }
  } 
}

const player = {
  x: 256, //character placed in the middle of the screen.
  y: 256,
  width: 32, //32x32 pixel size character.
  height: 32,
  speed: 3, //how fast player can move horizontally.
  mass: 64, //mass of player
  yke: 0, //kinetic energy on y-axis
  gpe: 0 //gravitational potential energy.
  //mass, yke, gpe are all required to calculate how fast player falls.
}

function calcGPE(obj) {
  return obj.mass * (9.8 / 1000000) * ((canvas.height - obj.height) - (obj.y / 32));
  // science shit
  // Now we need to create a function to update the player's Y position, the player's Y Kinetic Energy and the player's GPE, but first we will create a function that takes the player as a parameter and calculates the GPE of it. GPE = mass 9.8 height. 
  //As we will be working in pixels instead of meters we will need to divide the Gravitational Field Strength (9.8) by a million so it scales correctly, and as (0,0) on canvas is the top left we need to take the player's Y value from the height of the canvas (512 in my case), and finally so the GPE doesn't increase so quickly per pixel we will divide the player's 'height' by 32.
}

function gravity(obj) { //parameters for gravity.
  obj.y -= obj.yke;
  obj.yke -= obj.gpe;
  obj.gpe = calcGPE(obj);

  if (getTile(obj.x + 32, (obj.y + 32)) !== "0" || getTile(obj.x, (obj.y + 32)) !== "0") {
    if (obj.yke <= 0) {
      obj.yke = 0;
      obj.y -= (obj.y %32);
    }
  } //prevents player from falling through floors.

  if (getTile(obj.x, obj.y) !== "0" || getTile(obj.x + 32, obj.y) !== "0") {
    if (obj.yke >= 0) {
      obj.yke = -0.5; //this prevents player from getting stuck on the ceiling above.
      obj.y += 1;
    }
  } //prevents player from going through ceilings.
}

function draw() {
  c.clearRect(0, 0, canvas.width, canvas.height); //clears previous states of player position.
  c.fillStyle = "blue"; //sets color of the canvas fill
  c.fillRect(player.x, player.y, player.width, player.height); //draws the player rectangle and fills it. 
  c.fillStyle = "green";
  //loops through each level line, if the element is a "1", it will create a square in the space(relative to player position).
  for (let row = 0; row < currentLevel.length; row++) {
    for (let col = 0; col < currentLevel[0].length; col++) {
      if (currentLevel[row][col] === "1") {
        c.fillRect(col * 32, row * 32, 32, 32);
      }
    }
  }
}

function main() {
  draw();
  requestAnimationFrame(main); //loops the draw function repeatedly.
  input(); //allows for input to affect player.
  gravity(player); //causes gravity.
} 

window.onload = function() {
  currentLevel = parse(level); //return value of parse function.
  main(); //runs the code again once page is fully loaded.
}

const level = `0000000000000000 
0000000000000000
0010000000000000
0000000000001111
0000111000000000
0000000000011111
0000000000000000
0000000000111111
0000000000011000
1110000000000000
0000000010000110
0001111111100000
0000000000000000
0000000000000000
0000000001111110
0000000000000000`; //backticks are used for multi-line strings. This sets the level background, 0 = air, 1 = wall. Ideally these levels would be defined in external text files. 

function parse(lvl) {
  const lines = lvl.split("\n"); //splits the string into an array based on 'new line'.
  const characters = lines.map(l => l.split("")); // splits the characters in each line in the array by individual characters. Note**numbers cannot be taken as parameters in a => function.
  return characters;
}

function getTile(x, y) {
  return(currentLevel[Math.floor(y / 32)][Math.floor(x / 32)]); //gets the tile at a certain x and y value.
}



// draw(); //calls the draw function on line 11. This line was originally used to test function and player.