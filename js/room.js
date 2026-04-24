// Room functionality for Storytelling Website

let livingroomImg;
let pillowImg, puppyImg, waterCupImg;
let familyPhotoImg, diplomaImg;

// Sound effects
let pillowSound, puppySound, waterCupSound;

// Reference size (update to match your actual living room image dimensions)
let baseWidth  = 800;
let baseHeight = 600;

// These are set in draw() and used by scale functions
let drawWidth, drawHeight, drawX, drawY;

// ── Lightbox (fullscreen view) ────────────────────────────────────
let lightbox = {
  img:      null,
  alpha:    0,
  target:   0,   // 0 = closed, 255 = open
  open:     false,
  show(img) { this.img = img; this.target = 255; this.open = true;  },
  hide()    {                 this.target = 0;                       },
  draw() {
    if (this.alpha < 1 && this.target === 0) { this.open = false; return; }
    this.alpha = lerp(this.alpha, this.target, 0.1);

    // Dark overlay
    push();
    noStroke();
    fill(0, this.alpha * 0.82);
    rect(0, 0, width, height);

    if (this.img && this.alpha > 5) {
      // Fit image to 88% of screen keeping aspect ratio
      let maxW = width  * 0.88;
      let maxH = height * 0.88;
      let aspect = this.img.width / this.img.height;
      let iw, ih;
      if (maxW / aspect <= maxH) { iw = maxW; ih = maxW / aspect; }
      else                        { ih = maxH; iw = maxH * aspect; }

      let ix = (width  - iw) / 2;
      let iy = (height - ih) / 2;

      // Drop shadow
      drawingContext.shadowBlur  = 40;
      drawingContext.shadowColor = 'rgba(0,0,0,0.7)';
      tint(255, this.alpha);
      image(this.img, ix, iy, iw, ih);
      noTint();
      drawingContext.shadowBlur = 0;

      // Close hint
      fill(255, this.alpha * 0.7);
      textSize(13);
      textAlign(CENTER);
      text('click anywhere to close', width / 2, iy + ih + 22);
    }
    pop();
  },
  isOpen() { return this.open; }
};

// ── Hidden reveal class ───────────────────────────────────────────
class HiddenReveal {
  constructor(img, x, y, w, h) {
    this.img     = img;
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.alpha   = 0;
    this.visible = false;
  }

  show() { this.visible = true; }

  isHovered() {
    if (!this.visible || this.alpha < 200) return false;
    let px = scaleX(this.x), py = scaleY(this.y);
    let pw = scaleW(this.w), ph = scaleH(this.h);
    return mouseX > px && mouseX < px + pw &&
           mouseY > py && mouseY < py + ph;
  }

  click() {
    if (this.visible && this.alpha > 200) lightbox.show(this.img);
  }

  draw() {
    if (!this.visible && this.alpha < 1) return;
    if (this.visible) this.alpha = lerp(this.alpha, 255, 0.07);

    let px = scaleX(this.x), py = scaleY(this.y);
    let pw = scaleW(this.w), ph = scaleH(this.h);

    push();
    tint(255, this.alpha);
    image(this.img, px, py, pw, ph);
    noTint();

    // Hover outline once fully visible
    if (this.isHovered()) {
      cursor('pointer');
      noFill();
      stroke(255, 255, 255, 220);
      strokeWeight(3);
      rect(px, py, pw, ph, 6);
      stroke(255, 200, 100, 120);
      strokeWeight(1.5);
      rect(px - 4, py - 4, pw + 8, ph + 8, 8);
    }
    pop();
  }
}

// ── Interactive item class ────────────────────────────────────────
class RoomItem {
  constructor(img, sound, x, y, w, h, reveal) {
    this.img    = img;
    this.sound  = sound;
    this.reveal = reveal || null;

    this.startX = x; this.startY = y;
    this.w = w;      this.h = h;

    this.cx = x; this.cy = y;
    this.tx = x; this.ty = y;

    this.angle       = 0;
    this.targetAngle = 0;
    this.lerpSpeed   = 0.18;
    this.shoved      = false;
  }

  click() {
    if (this.shoved) return;

    if (this.sound) this.sound.play();

    let dirX   = random() > 0.5 ? 1 : -1;
    let shoveX = dirX * random(60, 120);
    let shoveY = random(-20, 30);

    this.tx = constrain(this.startX + shoveX, 2, baseWidth  - this.w - 2);
    this.ty = constrain(this.startY + shoveY, 2, baseHeight - this.h - 2);

    this.targetAngle = dirX * random(15, 30) * (PI / 180);
    this.lerpSpeed   = 0.22;
    this.shoved      = true;

    if (this.reveal) this.reveal.show();
  }

  update() {
    this.cx    = lerp(this.cx,    this.tx,          this.lerpSpeed);
    this.cy    = lerp(this.cy,    this.ty,          this.lerpSpeed);
    this.angle = lerp(this.angle, this.targetAngle, this.lerpSpeed);
  }

  isHovered() {
    if (this.shoved) return false;
    let px = scaleX(this.cx), py = scaleY(this.cy);
    let pw = scaleW(this.w),  ph = scaleH(this.h);
    return mouseX > px && mouseX < px + pw &&
           mouseY > py && mouseY < py + ph;
  }

  drawReveal() { if (this.reveal) this.reveal.draw(); }

  draw() {
    this.update();

    let px = scaleX(this.cx), py = scaleY(this.cy);
    let pw = scaleW(this.w),  ph = scaleH(this.h);

    push();
    translate(px + pw / 2, py + ph / 2);
    rotate(this.angle);

    imageMode(CENTER);
    image(this.img, 0, 0, pw, ph);

    if (this.isHovered()) {
      cursor('pointer');
      noFill();
      stroke(255, 255, 255, 220);
      strokeWeight(3);
      rectMode(CENTER);
      rect(0, 0, pw + 6, ph + 6, 6);
      stroke(255, 200, 100, 120);
      strokeWeight(1.5);
      rect(0, 0, pw + 10, ph + 10, 8);
    }

    imageMode(CORNER);
    pop();
  }
}

// ── Instances ─────────────────────────────────────────────────────
let pillowItem, puppyItem, waterCupItem;
let familyReveal, diplomaReveal;

function preload() {
  livingroomImg  = loadImage('../images/living room.jpg');
  pillowImg      = loadImage('../images/pillow.png');
  puppyImg       = loadImage('../images/puppy.png');
  waterCupImg    = loadImage('../images/watercup.png');
  familyPhotoImg = loadImage('../images/FamiliaHuggingFrame.png');
  diplomaImg     = loadImage('../images/HighschoolCertificate.png');

  pillowSound    = loadSound('../Sound effects/PillowCut.mp3',     null, () => console.warn('PillowCut.mp3 missing'));
  puppySound     = loadSound('../Sound effects/PuppyWhine.mp3',    null, () => console.warn('PuppyWhine.mp3 missing'));
  waterCupSound  = loadSound('../Sound effects/SpillGlassCut.mp3', null, () => console.warn('SpillGlassCut.mp3 missing'));
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  diplomaReveal = new HiddenReveal(diplomaImg,    498, 380, 80, 60);
  familyReveal  = new HiddenReveal(familyPhotoImg,  110, 335, 50, 40);


  // Pillow → diploma, Water cup → family photo
  pillowItem   = new RoomItem(pillowImg,   pillowSound,   498, 350,  85, 104, diplomaReveal);
  waterCupItem = new RoomItem(waterCupImg, waterCupSound, 113, 320,  38,  55, familyReveal);
  puppyItem    = new RoomItem(puppyImg,    puppySound,    639, 480,  85, 100, null);
}

function windowResized() {
  resizeCanvas(window.innerWidth, window.innerHeight);
}

// ── Scale helpers ─────────────────────────────────────────────────
function scaleX(x) { return drawX + (x / baseWidth)  * drawWidth;  }
function scaleY(y) { return drawY + (y / baseHeight) * drawHeight; }
function scaleW(w) { return (w / baseWidth)  * drawWidth;  }
function scaleH(h) { return (h / baseHeight) * drawHeight; }

// ── Draw ──────────────────────────────────────────────────────────
function draw() {
  background(220);

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

  // Reveals behind, items on top
  cursor('default');
  waterCupItem.drawReveal();
  pillowItem.drawReveal();

  waterCupItem.draw();
  pillowItem.draw();
  puppyItem.draw();

  // Arrow (top-right) — hidden while lightbox is open
  if (!lightbox.isOpen()) {
    let arrowX     = width - 80;
    let arrowY     = 50;
    let arrowSize  = 40;
    let arrowHover = mouseX > arrowX - 20 && mouseX < arrowX + arrowSize + 20 &&
                     mouseY > arrowY - 20  && mouseY < arrowY + 20;
    if (arrowHover) cursor('pointer');

    fill(arrowHover ? '#ffffff' : '#cccccc');
    stroke('#333333');
    strokeWeight(3);
    line(arrowX, arrowY, arrowX + arrowSize, arrowY);
    line(arrowX + arrowSize, arrowY, arrowX + arrowSize - 15, arrowY - 10);
    line(arrowX + arrowSize, arrowY, arrowX + arrowSize - 15, arrowY + 10);
  }

  // Lightbox drawn last — always on top
  lightbox.draw();
}

// ── Mouse ─────────────────────────────────────────────────────────
function mousePressed() {
  // If lightbox is open, any click closes it
  if (lightbox.isOpen()) {
    lightbox.hide();
    return;
  }

  // Check revealed images first (they open lightbox)
  if (diplomaReveal.isHovered()) { diplomaReveal.click(); return; }
  if (familyReveal.isHovered())  { familyReveal.click();  return; }

  // Then shove items
  if (pillowItem.isHovered())   { pillowItem.click();   return; }
  if (puppyItem.isHovered())    { puppyItem.click();    return; }
  if (waterCupItem.isHovered()) { waterCupItem.click(); return; }

  // Arrow navigation
  let arrowX    = width - 80;
  let arrowY    = 50;
  let arrowSize = 40;
  if (mouseX > arrowX - 20 && mouseX < arrowX + arrowSize + 20 &&
      mouseY > arrowY - 20  && mouseY < arrowY + 20) {
    window.location.href = 'kitchen.html';
  }
}