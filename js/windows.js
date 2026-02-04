let JNTS;
let doorImg;
let doorOpenImg;
let buildingImg;
let windows = []; // Store door positions

// ========================= PRELOAD =========================
function preload() {
  doorImg = loadImage('../images/door.png');
  doorOpenImg = loadImage('../images/door.open.png');
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
  let windowWidth = 150;
  let windowHeight = 260;
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
  
  // Check if mouse is hovering over the second door (index 1)
  let secondDoor = windows[1];
  let isHoveringSecondDoor = mouseX > secondDoor.x && mouseX < secondDoor.x + secondDoor.w &&
                             mouseY > secondDoor.y && mouseY < secondDoor.y + secondDoor.h;
  
  // Draw rectangle behind second door (before drawing doors)
  noStroke();
  fill('#2a2a2a');
  rect(secondDoor.x, secondDoor.y, secondDoor.w, secondDoor.h);
  
  // Draw doors
  noStroke();
  for (let i = 0; i < windows.length; i++) {
    let win = windows[i];
    
    // Use open door image for second door when hovering
    if (i === 1 && isHoveringSecondDoor) {
      image(doorOpenImg, win.x, win.y - 13, 150, 290); // Custom size for open door, positioned higher
    } else {
      image(doorImg, win.x, win.y, win.w, win.h);
    }
  }
}

function mousePressed() {
  // Check if second door was clicked
  let secondDoor = windows[1];
  if (mouseX > secondDoor.x && mouseX < secondDoor.x + secondDoor.w &&
      mouseY > secondDoor.y && mouseY < secondDoor.y + secondDoor.h) {
    window.location.href = 'room.html';
  }
}
