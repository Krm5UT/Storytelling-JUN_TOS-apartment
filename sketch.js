
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
 * Draws single window with fixed size, positioned relative to the building
 */
function drawWindows() {
  // Fixed window size and position
  let windowWidth = 160;
  let windowHeight = 230;
  let startX = width * 0.58;  // Positioned next to the door with spacing
  let startY = height * 0.50; // Aligned with the door vertically
  
  // Update windows array with responsive position
  // Preserve curtain animation state if window already exists
  let oldWindows = windows.length > 0 ? windows : null;
  windows = [
    { x: startX, y: startY, w: windowWidth, h: windowHeight, id: 0, curtainProgress: 0, curtainTarget: 0, isClosed: false }
  ];
  
  // Restore curtain animation state after position update
  if (oldWindows && oldWindows.length > 0) {
    windows[0].curtainProgress = oldWindows[0].curtainProgress;
    windows[0].curtainTarget = oldWindows[0].curtainTarget;
    windows[0].isClosed = oldWindows[0].isClosed;
  }
  
  // Check for hover and update curtain target
  hoveredWindow = null;
  let win = windows[0];
  if (mouseX > win.x && mouseX < win.x + win.w && mouseY > win.y && mouseY < win.y + win.h) {
    hoveredWindow = win.id;
    if (!win.isClosed) {
      win.curtainTarget = 1; // Close curtains on hover if not locked
    }
  } else {
    if (!win.isClosed) {
      win.curtainTarget = 0; // Open curtains when not hovering if not locked
    }
  }
  
  // If window is clicked closed, keep curtains closed
  if (win.isClosed) {
    win.curtainTarget = 1;
  }
  
  // Animate curtains with smooth lerp
  win.curtainProgress = lerp(win.curtainProgress, win.curtainTarget, 0.15);
  
  // Draw window rectangle
  noStroke();
  fill('#f7faff');
  rect(win.x, win.y, win.w, win.h);
  
  // Draw curtains (between window fill and frame)
  drawCurtains(win.x, win.y, win.w, win.h, win.curtainProgress);
  
  // Draw window image on top
  image(windowImg, win.x, win.y, win.w, win.h);
}

/**
 * Draws single door with animation and fixed size
 */
function drawDoors() {
  // Fixed door size and position
  door.w = 140;
  door.h = 250;
  door.x = width * 0.30;  // 25% from left edge
  door.y = height * 0.61; // 60% from top
  
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
  
  // Draw door background (visible when door opens)
  noStroke();
  fill('#1f1a19');
  rect(door.x, door.y, door.w, door.h);
  
  // Draw single door (swings inward to the left)
  push();
  translate(door.x, door.y);
  
  // Create 3D perspective effect
  let doorScale = cos(radians(openAngle));
  
  stroke('#1E1E1E');
  strokeWeight(2);
  fill('#615951');
  
  // Door with perspective
  rect(0, 0, door.w * doorScale, door.h);
  
  // Door shadow
  let shadowInset = 8;
  stroke('#3D3D3D');
  strokeWeight(3);
  noFill();
  rect(shadowInset, shadowInset, door.w * doorScale - 2 * shadowInset, door.h - 2 * shadowInset);
  
  // Door handle
  fill('#1E1E1E');
  noStroke();
  rect((door.w * doorScale) / 3, door.h / 2, 12 * doorScale, 3);
  
  pop();
}

/**
 * Draws animated curtains that close from both sides
 * @param {number} x - X position of window
 * @param {number} y - Y position of window
 * @param {number} w - Width of window
 * @param {number} h - Height of window
 * @param {number} progress - Animation progress (0 = open, 1 = closed)
 */
function drawCurtains(x, y, w, h, progress) {
  if (progress < 0.01) return; // Don't draw if curtains are fully open
  
  // Curtain width based on progress (each curtain covers half the window)
  let curtainWidth = (w / 2) * progress;
  
  // Curtain rod at top
  fill('#3d2b2b');
  noStroke();
  rect(x, y, w, 8);
  
  // Left curtain
  fill('#7a521a');
  rect(x, y + 8, curtainWidth, h - 8);
  
  // Left curtain shadow/fold detail
  stroke('#5a330f');
  strokeWeight(2);
  for (let i = 1; i < 4; i++) {
    let foldX = x + (curtainWidth / 4) * i;
    line(foldX, y + 8, foldX, y + h);
  }
  
  // Right curtain
  noStroke();
  fill('#7a521a');
  rect(x + w - curtainWidth, y + 8, curtainWidth, h - 8);
  
  // Right curtain shadow/fold detail
  stroke('#5a330f');
  strokeWeight(2);
  for (let i = 1; i < 4; i++) {
    let foldX = x + w - curtainWidth + (curtainWidth / 4) * i;
    line(foldX, y + 8, foldX, y + h);
  }
  
  // Curtain edge highlights for depth
  stroke('#9a3a3a');
  strokeWeight(1);
  line(x + curtainWidth - 1, y + 8, x + curtainWidth - 1, y + h);
  line(x + w - curtainWidth + 1, y + 8, x + w - curtainWidth + 1, y + h);
}

// ========================= DRAW =========================
function draw() {
  clear(); // Clear canvas to show background image
   
  // Calculate responsive building dimensions
  buildingWidth = width * 0.6;
  buildingX = (width - buildingWidth) / 2;
  buildingY = 0;
  buildingHeight = height;
  
  
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
  
  // Check if a window is clicked - lock curtains closed
  if (hoveredWindow !== null) {
    windows[hoveredWindow].isClosed = true;
    windows[hoveredWindow].curtainTarget = 1;
  }
}
