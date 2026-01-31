let ATA;
let windows = []; // Store window data
let hoveredWindow = null; // Track which window is hovered
let door = {
  w: 280,
  h: 200,
  x: 0,
  y: 0,
  openProgress: 0, // 0 closed, 1 open
  openTarget: 0,
  isOpen: false
};

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  ATA = select('#ATA');
  
  ATA.mouseOver(() => {
    ATA.style('color', '#7F8CA6'); // Change to a bright color on hover
    ATA.style('font-size', '10vh'); // Increase font size on hover
  });

  ATA.mouseOut(() => {
    ATA.style('color', '#ffffff'); // Revert to original color
    ATA.style('font-size', '8vh'); // Revert to original font size
  });
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background('#9DA7BB'); // Light blue-gray background
  
  //---------------------------- Draw 3 windows rectangles with spacing
  let windowWidth = 150;
  let windowHeight = 200;
  let spacing = 100; // Space between windows
  let totalWindowWidth = windowWidth * 3 + spacing * 2; // Total width of all windows
  let startX = (width - totalWindowWidth) / 2; // Center windows horizontally
  let startY = height * 0.13; // 20% from top
  
  // Update windows array
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
  
  // Window styling
  noStroke
  fill('#f7faff'); // off white window color
  
  // Draw windows
  noStroke();
  for (let win of windows) {
    fill(hoveredWindow === win.id ? '#fff2b6' : '#f7faff'); // Lighter on hover
    rect(win.x, win.y, win.w, win.h);
  }

  //Draw background of double doors to cover gaps when open
  noStroke();
  fill('#343e50');
  rect(door.x, door.y, door.w, door.h);

  //---------------------------- Draw double doors (animated)
  door.w = 280;
  door.h = 200;
  door.x = (width - door.w) / 2; // Center the door horizontally
  door.y = height * 0.58; // 58% from top

  // animate open/close
  door.openProgress = lerp(door.openProgress, door.openTarget, 0.18);
  if (abs(door.openProgress - door.openTarget) < 0.01) {
    door.openProgress = door.openTarget;
    door.isOpen = door.openTarget === 1;
  }
  // open on hover
  let doorHover = mouseX > door.x && mouseX < door.x + door.w && mouseY > door.y && mouseY < door.y + door.h;
  door.openTarget = doorHover ? 1 : 0;
  if (doorHover) cursor('pointer'); else cursor('default');
  
  // Door styling
  stroke('#1E1E1E'); // black outline
  strokeWeight(2);
  fill('#7F8CA6'); // grey-blueish color for door

  // sliding amount: each door half slides outward by half-width
  let halfW = door.w / 2;
  let slide = door.openProgress * (halfW);

  // Draw left door (slides left)
  rect(door.x - slide, door.y, halfW, door.h);

  // Draw right door (slides right)
  rect(door.x + halfW + slide, door.y, halfW, door.h);

  // Add inward shadows to doors (slightly inset)
  stroke('#3D3D3D'); // Darker shadow color
  strokeWeight(3);
  noFill();
  rect(door.x - slide + 8, door.y + 8, halfW - 16, door.h - 16);
  rect(door.x + halfW + slide + 8, door.y + 8, halfW - 16, door.h - 16);

  // Draw door handles (knobs) that move with doors
  fill('#1E1E1E');
  noStroke();
  rect(door.x - slide + halfW / 3, door.y + door.h / 2, 12, 3); // Left door handle
  rect(door.x + halfW + slide + (3 * halfW) / 5, door.y + door.h / 2, 12, 3); // Right door handle

}

function mousePressed() {
  // Check if door is clicked (toggle open and navigate after open)
  if (mouseX > door.x && mouseX < door.x + door.w && mouseY > door.y && mouseY < door.y + door.h) {
    // only navigate when doors are open and user clicks
    if (door.isOpen) {
      window.location.href = 'html/windows.html';
      return;
    }
    // if not open, ignore click (hover opens them)
    return;
  }

  if (hoveredWindow !== null) {
    console.log('Window ' + (hoveredWindow + 1) + ' clicked');
    // Add your window interaction logic here
  }
}