let ATA;
let windows = []; // Store window data
let hoveredWindow = null; // Track which window is hovered

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
    fill(hoveredWindow === win.id ? '#E8F0FF' : '#f7faff'); // Lighter on hover
    rect(win.x, win.y, win.w, win.h);
  }

  //---------------------------- Draw double doors
  let doorWidth = 280;
  let doorHeight = 200;
  let doorX = (width - doorWidth) / 2; // Center the door horizontally
  let doorY = height * 0.58; // 58% from top
  
  // Draw "ENTER" text above doors
  fill('#000');
  textFont('Serif');
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(48);
  text('ENTER', width / 2, doorY - 60);
  
  // Door styling
  stroke('#1E1E1E'); // black outline
  strokeWeight(2);
  fill('#7F8CA6'); // grey-blueish color for door
  
  // Draw left door
  rect(doorX, doorY, doorWidth / 2, doorHeight);
  
  // Draw right door
  rect(doorX + doorWidth / 2, doorY, doorWidth / 2, doorHeight);

  // Add inward shadows to doors
  stroke('#3D3D3D'); // Darker shadow color
  strokeWeight(3);
  noFill();
  // Shadow for left door
  rect(doorX + 8, doorY + 8, doorWidth / 2 - 16, doorHeight - 16);
  // Shadow for right door
  rect(doorX + doorWidth / 2 + 8, doorY + 8, doorWidth / 2 - 16, doorHeight - 16);
  
  // Draw door handles (knobs)
  fill('#1E1E1E'); // Gold color
  noStroke();
  rect(doorX + doorWidth / 3, doorY + doorHeight / 2, 12, 3); // Left door handle
  rect(doorX + 3 * doorWidth / 5, doorY + doorHeight / 2, 12, 3); // Right door handle
}

function mousePressed() {
  if (hoveredWindow !== null) {
    console.log('Window ' + (hoveredWindow + 1) + ' clicked');
    // Add your window interaction logic here
  }
}