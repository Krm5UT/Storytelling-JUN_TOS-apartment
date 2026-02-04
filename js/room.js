// Room functionality for Storytelling Website

let roomImg;

function preload() {
  // Load the room image before setup runs
  roomImg = loadImage('../images/room.png');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background(220);
  
  // Calculate aspect ratios
  let imgAspect = roomImg.width / roomImg.height;
  let canvasAspect = width / height;
  
  let drawWidth, drawHeight, drawX, drawY;
  
  // Cover the entire canvas (like CSS background-size: cover)
  if (canvasAspect > imgAspect) {
    // Canvas is wider than image
    drawWidth = width;
    drawHeight = width / imgAspect;
    drawX = 0;
    drawY = (height - drawHeight) / 2;
  } else {
    // Canvas is taller than image
    drawWidth = height * imgAspect;
    drawHeight = height;
    drawX = (width - drawWidth) / 2;
    drawY = 0;
  }
  
  // Display the room image centered and scaled
  image(roomImg, drawX, drawY, drawWidth, drawHeight);
}