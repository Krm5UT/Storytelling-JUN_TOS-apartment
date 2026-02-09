// Room functionality for Storytelling Website

let kitchenImg;
let boyHappyImg, boyWorriedImg, boySadImg;
let currentBoyImg;
let boyClickCount = 0;

// Boy size and position (adjust boyBaseHeight to change size)
let boyBaseHeight = 300; // Adjust this value to change boy size
let boyHappyWidth, boyHappyHeight;
let boyWorriedWidth, boyWorriedHeight;
let boySadWidth, boySadHeight;
let boyWidth = 0;
let boyHeight = 0;
let boyX = 0;
let boyY = 0;

function preload() {
  // Load the room image before setup runs
  kitchenImg = loadImage('../images/kitchen.jpg');
  boyHappyImg = loadImage('../images/boy.happy.png');
  boyWorriedImg = loadImage('../images/boy.worried.png');
  boySadImg = loadImage('../images/boy.sad.png');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  
  // Calculate dimensions for each boy image based on their own aspect ratio
  let happyAspect = boyHappyImg.width / boyHappyImg.height;
  boyHappyHeight = boyBaseHeight;
  boyHappyWidth = boyHappyHeight * happyAspect;
  
  let worriedAspect = boyWorriedImg.width / boyWorriedImg.height;
  boyWorriedHeight = boyBaseHeight;
  boyWorriedWidth = boyWorriedHeight * worriedAspect;
  
  let sadAspect = boySadImg.width / boySadImg.height;
  boySadHeight = boyBaseHeight;
  boySadWidth = boySadHeight * sadAspect;
  
  // Start with happy boy
  currentBoyImg = boyHappyImg;
  boyWidth = boyHappyWidth;
  boyHeight = boyHappyHeight;
  
  // Position boy (centered horizontally, bottom of screen)
  boyX = (width - boyWidth) / 2;
  boyY = height - boyHeight - 50;
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
  
  // Reposition boy when window resizes
  boyX = (width - boyWidth) / 2;
  boyY = height - boyHeight - 50;
}

function draw() {
  background(220);
  
  // Calculate aspect ratios
  let imgAspect = kitchenImg.width / kitchenImg.height;
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
  
  // Display the kitchen image centered and scaled
  image(kitchenImg, drawX, drawY, drawWidth, drawHeight);
  
  // Draw boy image ON TOP of kitchen
  image(currentBoyImg, boyX, boyY, boyWidth, boyHeight);
  
  // Check if mouse is hovering over boy
  let isHoveringBoy = mouseX > boyX && mouseX < boyX + boyWidth &&
                      mouseY > boyY && mouseY < boyY + boyHeight;
  
  cursor(isHoveringBoy ? 'pointer' : 'default');
}

function mousePressed() {
  // Check if boy was clicked
  if (mouseX > boyX && mouseX < boyX + boyWidth &&
      mouseY > boyY && mouseY < boyY + boyHeight) {
    
    boyClickCount++;
    
    // First click: change to worried
    if (boyClickCount === 1) {
      currentBoyImg = boyWorriedImg;
      boyWidth = boyWorriedWidth;
      boyHeight = boyWorriedHeight;
      // Recenter after size change
      boyX = (width - boyWidth) / 2;
      boyY = height - boyHeight - 50;
    }
    // Second click: change to sad
    else if (boyClickCount === 2) {
      currentBoyImg = boySadImg;
      boyWidth = boySadWidth;
      boyHeight = boySadHeight;
      // Recenter after size change
      boyX = (width - boyWidth) / 2;
      boyY = height - boyHeight - 50;
    }
    // Fourth click: navigate to ending
    else if (boyClickCount >= 4) {
      window.location.href = 'ending.html';
    }
  }
}