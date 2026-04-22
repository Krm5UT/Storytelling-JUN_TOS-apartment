// ========================= GLOBAL VARIABLES =========================
let windowImg;
let buildingImg;
let JNTS;

// Sound effects
let knockSound;
let curtainSound;
let curtainSoundPlaying = false;

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

// Door click counter
let doorClickCount = 0;

// Phone images
let phoneMapImg;
let phoneProfileImg;
let phoneState = 'map'; // 'map' or 'profile'
let phoneVisible = true; // ← NEW: controls visibility

// Phone position/size
let phone = {
  x: 0,
  y: 0,
  w: 0,
  h: 0
};


// ========================= PRELOAD =========================
function preload() {
  windowImg       = loadImage('images/window.png');
  buildingImg     = loadImage('images/OIP.webp');
  knockSound      = loadSound('Sound effects/Knock On Wooden Door_01.mp3', null, () => console.warn('knock sound missing'));
  curtainSound    = loadSound('Sound effects/CurtainClose.mp3',            null, () => console.warn('curtain sound missing'));
  phoneMapImg     = loadImage('images/PhoneMap.png');
  phoneProfileImg = loadImage('images/Profile.png');
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
 * Draws the phone element (map or profile) and updates its hit-box
 */
function drawPhone() {
  if (!phoneVisible) return; // ← Don't draw if dismissed

  phone.w = width * 0.22;
  phone.h = phone.w * 2.1;
  phone.x = width * 0.50;
  phone.y = height * 0.05;

  let img = (phoneState === 'map') ? phoneMapImg : phoneProfileImg;
  image(img, phone.x, phone.y, phone.w, phone.h);

  // Subtle hover highlight
  if (isOverPhone()) {
    noFill();
    stroke(255, 255, 255, 80);
    strokeWeight(3);
    rect(phone.x, phone.y, phone.w, phone.h, 18);
    cursor('pointer');
  }
}

function isOverPhone() {
  if (!phoneVisible) return false; // ← Can't hover hidden phone
  return mouseX > phone.x && mouseX < phone.x + phone.w &&
         mouseY > phone.y && mouseY < phone.y + phone.h;
}

/**
 * Draws single window with fixed size, positioned relative to the building
 */
function drawWindows() {
  // When phone is visible, skip hover detection entirely
  let checkHover = !phoneVisible;

  let windowWidth  = 160;
  let windowHeight = 230;
  let startX = width * 0.58;
  let startY = height * 0.50;
  
  let oldWindows = windows.length > 0 ? windows : null;
  windows = [
    { x: startX, y: startY, w: windowWidth, h: windowHeight, id: 0, curtainProgress: 0, curtainTarget: 0, isClosed: false }
  ];
  
  if (oldWindows && oldWindows.length > 0) {
    windows[0].curtainProgress = oldWindows[0].curtainProgress;
    windows[0].curtainTarget   = oldWindows[0].curtainTarget;
    windows[0].isClosed        = oldWindows[0].isClosed;
  }
  
  hoveredWindow = null;
  let win = windows[0];

  // Only process hover/curtain interaction when phone is not visible
  if (checkHover && mouseX > win.x && mouseX < win.x + win.w && mouseY > win.y && mouseY < win.y + win.h) {
    hoveredWindow = win.id;
    if (!win.isClosed) {
      win.curtainTarget = 1;
      if (!curtainSoundPlaying) {
        curtainSound.play();
        curtainSoundPlaying = true;
      }
    }
  } else {
    if (!win.isClosed) win.curtainTarget = 0;
    curtainSoundPlaying = false;
  }
  
  if (win.isClosed) win.curtainTarget = 1;
  
  win.curtainProgress = lerp(win.curtainProgress, win.curtainTarget, 0.15);
  
  noStroke();
  fill('#f7faff');
  rect(win.x, win.y, win.w, win.h);
  
  drawCurtains(win.x, win.y, win.w, win.h, win.curtainProgress);
  image(windowImg, win.x, win.y, win.w, win.h);
}

/**
 * Draws single door with animation and fixed size
 */
function drawDoors() {
  door.w = 140;
  door.h = 250;
  door.x = width * 0.30;
  door.y = height * 0.61;
  
  door.openProgress = lerp(door.openProgress, door.openTarget, 0.18);
  if (abs(door.openProgress - door.openTarget) < 0.01) {
    door.openProgress = door.openTarget;
    door.isOpen = door.openTarget === 1;
  }
  
  // Only allow door hover/open when phone is not visible
  let doorHover = !phoneVisible &&
                  mouseX > door.x && mouseX < door.x + door.w &&
                  mouseY > door.y && mouseY < door.y + door.h;

  if (doorClickCount >= 3) {
    door.openTarget = doorHover ? 1 : 0;
  } else {
    door.openTarget = 0;
  }
  
  let openAngle = door.openProgress * 75;
  
  noStroke();
  fill('#1f1a19');
  rect(door.x, door.y, door.w, door.h);
  
  push();
  translate(door.x, door.y);
  
  let doorScale = cos(radians(openAngle));
  
  stroke('#1E1E1E');
  strokeWeight(2);
  fill('#615951');
  rect(0, 0, door.w * doorScale, door.h);
  
  let shadowInset = 8;
  stroke('#3D3D3D');
  strokeWeight(3);
  noFill();
  rect(shadowInset, shadowInset, door.w * doorScale - 2 * shadowInset, door.h - 2 * shadowInset);
  
  fill('#1E1E1E');
  noStroke();
  rect((door.w * doorScale) / 3, door.h / 2, 15 * doorScale, 3);
  
  pop();
}

/**
 * Draws animated curtains
 */
function drawCurtains(x, y, w, h, progress) {
  if (progress < 0.01) return;
  
  let curtainWidth = (w / 2) * progress;
  
  fill('#3d2b2b');
  noStroke();
  rect(x, y, w, 8);
  
  fill('#7a521a');
  rect(x, y + 8, curtainWidth, h - 8);
  
  stroke('#5a330f');
  strokeWeight(2);
  for (let i = 1; i < 4; i++) {
    let foldX = x + (curtainWidth / 4) * i;
    line(foldX, y + 8, foldX, y + h);
  }
  
  noStroke();
  fill('#7a521a');
  rect(x + w - curtainWidth, y + 8, curtainWidth, h - 8);
  
  stroke('#5a330f');
  strokeWeight(2);
  for (let i = 1; i < 4; i++) {
    let foldX = x + w - curtainWidth + (curtainWidth / 4) * i;
    line(foldX, y + 8, foldX, y + h);
  }
  
  stroke('#9a3a3a');
  strokeWeight(1);
  line(x + curtainWidth - 1, y + 8, x + curtainWidth - 1, y + h);
  line(x + w - curtainWidth + 1, y + 8, x + w - curtainWidth + 1, y + h);
}

// ========================= DRAW =========================
function draw() {
  clear();
   
  buildingWidth  = width * 0.6;
  buildingX      = (width - buildingWidth) / 2;
  buildingY      = 0;
  buildingHeight = height;
  
  drawWindows();
  drawDoors();
  drawPhone();

  // Cursor logic
  if (phoneVisible) {
    // While phone is up, only phone gets pointer — everything else is default
    cursor(isOverPhone() ? 'pointer' : 'default');
  } else {
    let doorHover   = mouseX > door.x && mouseX < door.x + door.w &&
                      mouseY > door.y && mouseY < door.y + door.h;
    let windowHover = hoveredWindow !== null;
    let phoneHover  = isOverPhone();

    if (!phoneHover) {
      cursor((doorHover || windowHover) ? 'pointer' : 'default');
    }
  }
}

// ========================= MOUSE INTERACTIONS =========================
function mousePressed() {
  // --- Phone is visible: only phone interactions allowed ---
  if (phoneVisible) {
    if (isOverPhone()) {
      // Toggle between map and profile
      phoneState = (phoneState === 'map') ? 'profile' : 'map';
    } else {
      // Clicked outside — dismiss phone
      phoneVisible = false;
    }
    return; // ← Blocks ALL other interactions while phone is up
  }

  // --- Phone is hidden: normal interactions ---

  // Door click
  if (mouseX > door.x && mouseX < door.x + door.w &&
      mouseY > door.y && mouseY < door.y + door.h) {
    knockSound.play();
    doorClickCount++;
    if (door.isOpen && doorClickCount >= 3) {
      window.location.href = 'html/room.html';
    }
    return;
  }
  
  // Window click — lock curtains closed
  if (hoveredWindow !== null) {
    windows[hoveredWindow].isClosed      = true;
    windows[hoveredWindow].curtainTarget = 1;
  }
}