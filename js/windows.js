let ATA;
let windows = []; // Store window data
let hoveredWindow = null; // Track which window is hovered

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

function draw() {
  background('#9DA7BB'); // Light blue-gray background
  
  //---------------------------- Draw 3 windows rectangles with spacing
  let windowWidth = 120;
  let windowHeight = 160;
  let spacing = 80; // Space between windows
  let totalWindowWidth = windowWidth * 3 + spacing * 2; // Total width of all windows
  let startX = (width - totalWindowWidth) / 2; // Center windows horizontally
  let startY = height * 0.13; // 20% from top
  

  // Update windows array
  windows = [
    { x: startX, y: startY, w: windowWidth, h: windowHeight, id: 0 },
    { x: startX + windowWidth + spacing, y: startY, w: windowWidth, h: windowHeight, id: 1 },
    { x: startX + 2 * (windowWidth + spacing), y: startY, w: windowWidth, h: windowHeight, id: 2 },
    { x: startX, y: startY + windowHeight + spacing, w: windowWidth, h: windowHeight, id: 3 },
    { x: startX + windowWidth + spacing, y: startY + windowHeight + spacing, w: windowWidth, h: windowHeight, id: 4 },
    { x: startX + 2 * (windowWidth + spacing), y: startY + windowHeight + spacing, w: windowWidth, h: windowHeight, id: 5 },
    { x: startX, y: startY + 2 * (windowHeight + spacing), w: windowWidth, h: windowHeight, id: 6 },
    { x: startX + windowWidth + spacing, y: startY + 2 * (windowHeight + spacing), w: windowWidth, h: windowHeight, id: 7 },
    { x: startX + 2 * (windowWidth + spacing), y: startY + 2 * (windowHeight + spacing), w: windowWidth, h: windowHeight, id: 8 }
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
  noStroke();
  fill('#f7faff'); // off white window color
  
  // Draw windows
  noStroke();
  for (let win of windows) {
    fill(hoveredWindow === win.id ? '#fff2b6' : '#f7faff'); // Lighter on hover
    rect(win.x, win.y, win.w, win.h);
  }
}

function mousePressed() {
  if (hoveredWindow !== null) {
    console.log('Window ' + (hoveredWindow + 1) + ' clicked');
    // Add your window interaction logic here
  }
}