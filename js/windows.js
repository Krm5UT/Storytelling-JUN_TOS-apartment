let JNTS;
let doorImg;
let buildingImg;
let windows = []; // Store door positions

// ========================= PRELOAD =========================
function preload() {
  doorImg = loadImage('../images/door.png');
  buildingImg = loadImage('../images/OIP.webp');
}


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background('#9DA7BB');
  
  // Calculate responsive building dimensions
  buildingWidth = width * 0.6;
  buildingX = (width - buildingWidth) / 2;
  buildingY = 0;
  buildingHeight = height;
  
  // Draw side environments
  fill('#87a1d3');
  rect(0, 0, buildingX, height);
  rect(buildingX + buildingWidth, 0, buildingX, height);
  
  // Draw building body with image
  tint(200, 205); // Slight transparency
  image(buildingImg, buildingX, buildingY, buildingWidth, buildingHeight);
  noTint();
  
  //---------------------------- Draw 3 door rectangles with spacing
  let windowWidth = 190;
  let windowHeight = 210;
  let spacing = 70; // Space between windows
  let rowOffset = 40; // Extra drop for bottom row
  let totalWindowWidth = windowWidth * 3 + spacing * 2; // Total width of all windows
  let startX = (width - totalWindowWidth) / 2; // Center windows horizontally
  let startY = height * 0.13; // 20% from top
  

  // Update windows array
  let bottomRowY = startY + windowHeight + spacing + rowOffset;
  let dividerY = startY + windowHeight + (spacing + rowOffset) / 2;

  windows = [
    { x: startX, y: startY, w: windowWidth, h: windowHeight, id: 0 },
    { x: startX + windowWidth + spacing, y: startY, w: windowWidth, h: windowHeight, id: 1 },
    { x: startX + 2 * (windowWidth + spacing), y: startY, w: windowWidth, h: windowHeight, id: 2 },
    { x: startX, y: bottomRowY, w: windowWidth, h: windowHeight, id: 3 },
    { x: startX + windowWidth + spacing, y: bottomRowY, w: windowWidth, h: windowHeight, id: 4 },
    { x: startX + 2 * (windowWidth + spacing), y: bottomRowY, w: windowWidth, h: windowHeight, id: 5 }
  ];

  // Draw divider line between rows
  stroke('#1E1E1E');
  strokeWeight(10);
  line(buildingX, dividerY, buildingX + buildingWidth, dividerY);
  
  // Draw doors
  noStroke();
  for (let win of windows) {
    image(doorImg, win.x, win.y, win.w, win.h);
  }
}
