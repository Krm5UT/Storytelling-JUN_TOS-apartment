// Room functionality for Storytelling Website

let livingroomImg;

function preload() {
  // Load the room image before setup runs
  livingroomImg = loadImage('../images/living room.jpg');
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
  let imgAspect = livingroomImg.width / livingroomImg.height;
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
  image(livingroomImg, drawX, drawY, drawWidth, drawHeight);
  
  // Draw arrow in top right corner
  let arrowX = width - 80;
  let arrowY = 50;
  let arrowSize = 40;
  
  // Check if mouse is hovering over arrow
  let isHovering = mouseX > arrowX - 20 && mouseX < arrowX + arrowSize + 20 &&
                   mouseY > arrowY - 20 && mouseY < arrowY + 20;
  
  cursor(isHovering ? 'pointer' : 'default');
  
  // Draw arrow
  fill(isHovering ? '#ffffff' : '#cccccc');
  stroke('#333333');
  strokeWeight(3);
  
  // Arrow shaft
  line(arrowX, arrowY, arrowX + arrowSize, arrowY);
  
  // Arrow head
  line(arrowX + arrowSize, arrowY, arrowX + arrowSize - 15, arrowY - 10);
  line(arrowX + arrowSize, arrowY, arrowX + arrowSize - 15, arrowY + 10);
}

function mousePressed() {
  // Check if arrow was clicked
  let arrowX = width - 80;
  let arrowY = 50;
  let arrowSize = 40;
  
  if (mouseX > arrowX - 20 && mouseX < arrowX + arrowSize + 20 &&
      mouseY > arrowY - 20 && mouseY < arrowY + 20) {
    window.location.href = 'kitchen.html';
  }
}