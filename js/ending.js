// Ending page for Storytelling Website

let outsideHouseImg;
let textIndex = 0;
let messages = [
  "Congrats you just earned your bonus!",
  "A loving and hardworking father has now been seperated from his family.",
  "Don't forget to also detain the child before you leave, who knows maybe you'll get paid more"
];

function preload() {
  // Load the outside house image
  outsideHouseImg = loadImage('../images/outsidehouse.jpg');
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
  let imgAspect = outsideHouseImg.width / outsideHouseImg.height;
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
  
  // Display the outside house image centered and scaled
  image(outsideHouseImg, drawX, drawY, drawWidth, drawHeight);
  
  // Draw text box only if there are messages left to show
  if (textIndex < messages.length) {
    // Draw semi-transparent background box
    let boxWidth = width * 0.7;
    let boxHeight = 150;
    let boxX = (width - boxWidth) / 2;
    let boxY = (height - boxHeight) / 2;
    
    fill(0, 0, 0, 180); // Black with transparency
    rect(boxX, boxY, boxWidth, boxHeight, 10); // Rounded corners
    
    // Draw text
    fill(255); // White text
    textAlign(CENTER, CENTER);
    textSize(24);
    textWrap(WORD);
    text(messages[textIndex], boxX + 20, boxY + 20, boxWidth - 40, boxHeight - 40);
  }
}

function mousePressed() {
  // Advance to next message
  if (textIndex < messages.length - 1) {
    textIndex++;
  } else {
    // Optional: hide box after last message
    textIndex++; // This will make textIndex >= messages.length, hiding the box
  }
}