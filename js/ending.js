// Ending page for Storytelling Website

let outsideHouseImg;
let textIndex = 0;
let messages = [
  "Congrats you just earned your bonus!"
];

function preload() {
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

  let imgAspect    = outsideHouseImg.width / outsideHouseImg.height;
  let canvasAspect = width / height;
  let drawWidth, drawHeight, drawX, drawY;

  if (canvasAspect > imgAspect) {
    drawWidth  = width;
    drawHeight = width / imgAspect;
    drawX = 0;
    drawY = (height - drawHeight) / 2;
  } else {
    drawWidth  = height * imgAspect;
    drawHeight = height;
    drawX = (width - drawWidth) / 2;
    drawY = 0;
  }

  image(outsideHouseImg, drawX, drawY, drawWidth, drawHeight);

  // ── Text box (visible while messages remain) ──────────────────
  if (textIndex < messages.length) {
    let boxWidth  = width * 0.7;
    let boxHeight = 150;
    let boxX      = (width  - boxWidth)  / 2;
    let boxY      = (height - boxHeight) / 2;

    noStroke();
    fill(0, 0, 0, 180);
    rect(boxX, boxY, boxWidth, boxHeight, 10);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    textWrap(WORD);
    text(messages[textIndex], boxX + 20, boxY + 20, boxWidth - 40, boxHeight - 40);
  }

  // ── Click prompt (visible after box is dismissed) ─────────────
  if (textIndex >= messages.length) {
    fill(255, 0, 0, 150);
    noStroke();
    textSize(25);
    textAlign(CENTER, CENTER);
    text('click to continue...', width / 2, height - 40);
  }
}

function mousePressed() {
  if (textIndex < messages.length - 1) {
    textIndex++;                              // advance messages
  } else if (textIndex === messages.length - 1) {
    textIndex++;                              // hides the box, shows prompt
  } else {
    window.location.href = '../html/Awareness.html'; // go to awareness page
  }
}