// Room functionality for Storytelling Website

let livingroomImg;
let pillowImg, puppyImg, waterCupImg;

let pillow   = { x: 498, y: 350, w: 85,  h: 104 };
let puppy    = { x: 639, y: 480, w: 85,  h: 100  };
let waterCup = { x: 113, y: 320, w: 38,  h: 55  };

// These are set in draw() and used by scaleX/Y/W/H
let drawWidth, drawHeight, drawX, drawY;

// Reference size the positions above were measured on
let baseWidth  = 800;
let baseHeight = 600;

function preload() {
  livingroomImg = loadImage('../images/living room.jpg');
  pillowImg     = loadImage('../images/pillow.png');
  puppyImg      = loadImage('../images/puppy.png');
  waterCupImg   = loadImage('../images/watercup.png');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// Scale a reference x/y/w/h to the current drawn image area
function scaleX(x) { return drawX + (x / baseWidth)  * drawWidth;  }
function scaleY(y) { return drawY + (y / baseHeight) * drawHeight; }
function scaleW(w) { return (w / baseWidth)  * drawWidth;  }
function scaleH(h) { return (h / baseHeight) * drawHeight; }

function draw() {
  background(220);

  // ── Draw background (cover) ──────────────────────────────────
  // imgAspect must be declared BEFORE it is used
  let imgAspect    = livingroomImg.width / livingroomImg.height;
  let canvasAspect = width / height;

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

  image(livingroomImg, drawX, drawY, drawWidth, drawHeight);

  // ── Draw room objects ─────────────────────────────────────────
  image(waterCupImg,
    scaleX(waterCup.x), scaleY(waterCup.y),
    scaleW(waterCup.w), scaleH(waterCup.h)
  );

  image(pillowImg,
    scaleX(pillow.x), scaleY(pillow.y),  
    scaleW(pillow.w), scaleH(pillow.h)
  );

  image(puppyImg,
    scaleX(puppy.x), scaleY(puppy.y),     
    scaleW(puppy.w), scaleH(puppy.h)
  );

  // ── Draw arrow (top-right) ────────────────────────────────────
  let arrowX    = width - 80;
  let arrowY    = 50;
  let arrowSize = 40;

  let isHovering = mouseX > arrowX - 20 && mouseX < arrowX + arrowSize + 20 &&
                   mouseY > arrowY - 20  && mouseY < arrowY + 20;

  cursor(isHovering ? 'pointer' : 'default');

  fill(isHovering ? '#ffffff' : '#cccccc');
  stroke('#333333');
  strokeWeight(3);
  line(arrowX, arrowY, arrowX + arrowSize, arrowY);
  line(arrowX + arrowSize, arrowY, arrowX + arrowSize - 15, arrowY - 10);
  line(arrowX + arrowSize, arrowY, arrowX + arrowSize - 15, arrowY + 10);
}

function mousePressed() {
  let arrowX    = width - 80;
  let arrowY    = 50;
  let arrowSize = 40;

  if (mouseX > arrowX - 20 && mouseX < arrowX + arrowSize + 20 &&
      mouseY > arrowY - 20  && mouseY < arrowY + 20) {
    window.location.href = 'kitchen.html';
  }
}