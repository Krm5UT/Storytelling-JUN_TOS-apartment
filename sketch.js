
// ========================= GLOBAL VARIABLES =========================
let windowImg;
let buildingImg;
let JNTS;

// Building dimensions (responsive)
let buildingWidth;
let buildingHeight;
let buildingX;
let buildingY;

// Windows array and state
let windows = [];
let hoveredWindow = null;
let activeWindows = new Set();

// Door object and animation state
let door = {
  w: 0,
  h: 0,
  x: 0,
  y: 0,
  openProgress: 0,
  openTarget: 0,
  isOpen: false
};


// ========================= PRELOAD =========================
function preload() {
  windowImg = loadImage('images/window.png');
  buildingImg = loadImage('images/OIP.webp');
}


// ========================= SETUP =========================
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  JNTS = select('#JNTS');
}

// ========================= WINDOW RESIZE =========================
function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// ========================= HELPER FUNCTIONS =========================
/**
 * Draws all windows with fixed sizes, positioned relative to the building
 */
function drawWindows() {
  // Fixed dimensions
  let windowWidth = 150;
  let windowHeight = 200;
  let spacing = 100;
  let totalWindowWidth = windowWidth * 3 + spacing * 2;
  let startX = buildingX + (buildingWidth - totalWindowWidth) / 2;
  let startY = buildingHeight * 0.13;
  
  // Update windows array with responsive positions
  windows = [
    { x: startX, y: startY, w: windowWidth, h: windowHeight, id: 0 },
    { x: startX + windowWidth + spacing, y: startY, w: windowWidth, h: windowHeight, id: 1 },
    { x: startX + 2 * (windowWidth + spacing), y: startY, w: windowWidth, h: windowHeight, id: 2 }
  ];
  
  // Check for hover
  hoveredWindow = null;
  for (let win of windows) {
    if (mouseX > win.x && mouseX < win.x + win.w && mouseY > win.y && mouseY < win.y + win.h) {
      hoveredWindow = win.id;
      break;
    }
  }
  
  // Draw window rectangles
  noStroke();
  for (let win of windows) {
    fill(activeWindows.has(win.id) ? '#fff2b6' : '#f7faff');
    rect(win.x, win.y, win.w, win.h);
  }
  
  // Draw window images on top
  for (let win of windows) {
    image(windowImg, win.x, win.y, win.w, win.h);
  }
}

/**
 * Draws double push/pull doors with animation and fixed size
 */
function drawDoors() {
  // Fixed door dimensions
  door.w = 280;
  door.h = 200;
  door.x = buildingX + (buildingWidth - door.w) / 2;
  door.y = buildingHeight * 0.58;
  
  // Animate door open/close
  door.openProgress = lerp(door.openProgress, door.openTarget, 0.18);
  if (abs(door.openProgress - door.openTarget) < 0.01) {
    door.openProgress = door.openTarget;
    door.isOpen = door.openTarget === 1;
  }
  
  // Check hover and update target
  let doorHover = mouseX > door.x && mouseX < door.x + door.w && mouseY > door.y && mouseY < door.y + door.h;
  door.openTarget = doorHover ? 1 : 0;
  cursor(doorHover ? 'pointer' : 'default');
  
  // Calculate opening angle and perspective scaling
  let maxAngle = 75; // Maximum opening angle in degrees
  let openAngle = door.openProgress * maxAngle;
  
  let halfW = door.w / 2;
  
  // Draw door background (visible when doors open)
  noStroke();
  fill('#1f1a19');
  rect(door.x, door.y, door.w, door.h);
  
  // Draw left door (swings inward to the left)
  push();
  translate(door.x, door.y);
  
  // Create 3D perspective effect
  let leftScale = cos(radians(openAngle));
  
  stroke('#1E1E1E');
  strokeWeight(2);
  fill('#615951');
  
  // Left door with perspective
  rect(0, 0, halfW * leftScale, door.h);
  
  // Left door shadow
  let shadowInset = 8;
  stroke('#3D3D3D');
  strokeWeight(3);
  noFill();
  rect(shadowInset, shadowInset, halfW * leftScale - 2 * shadowInset, door.h - 2 * shadowInset);
  
  // Left door handle
  fill('#1E1E1E');
  noStroke();
  rect((halfW * leftScale) / 3, door.h / 2, 12 * leftScale, 3);
  
  pop();
  
  // Draw right door (swings inward to the right)
  push();
  translate(door.x + door.w, door.y);
  
  let rightScale = cos(radians(openAngle));
  
  stroke('#1E1E1E');
  strokeWeight(2);
  fill('#615951');
  
  // Right door with perspective (opens from right side toward center)
  rect(-halfW * rightScale, 0, halfW * rightScale, door.h);
  
  // Right door shadow
  stroke('#3D3D3D');
  strokeWeight(3);
  noFill();
  rect(-halfW * rightScale + shadowInset, shadowInset, halfW * rightScale - 2 * shadowInset, door.h - 2 * shadowInset);
  
  // Right door handle
  fill('#1E1E1E');
  noStroke();
  rect(-halfW * rightScale + (halfW * rightScale) / 3, door.h / 2, 12 * rightScale, 3);
  
  pop();
}

// ========================= DRAW =========================
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
  tint(255, 200);
  image(buildingImg, buildingX, buildingY, buildingWidth, buildingHeight);
  noTint();
  
  // Draw windows and doors
  drawWindows();
  drawDoors();
}

// ========================= MOUSE INTERACTIONS =========================
function mousePressed() {
  // Check if door is clicked
  if (mouseX > door.x && mouseX < door.x + door.w && mouseY > door.y && mouseY < door.y + door.h) {
    if (door.isOpen) {
      window.location.href = 'html/windows.html';
    }
    return;
  }
  
  // Check if a window is clicked
  if (hoveredWindow !== null) {
    if (activeWindows.has(hoveredWindow)) {
      activeWindows.delete(hoveredWindow);
      console.log('Window ' + (hoveredWindow + 1) + ' turned off');
    } else {
      activeWindows.add(hoveredWindow);
      console.log('Window ' + (hoveredWindow + 1) + ' turned on');
    }
  }
}
