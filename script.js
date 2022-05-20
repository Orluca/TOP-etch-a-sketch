"use strict";
// ---------- GENERAL VARIABLES ----------
let resolution; // Resolution of the canvas and the default value
let mouseIsPressed = false; // Tracks if the left mouse button is pressed down
let activeColor = "rgb(0, 0, 0)"; // Set default color to black
let activeTool = "pencil";
let mousePos = {};
let lastUsedColor; // to temporarily store and restore the active color when switching to the eraser
let gridIsActive = false;

const joe = colorjoe.rgb("colorjoe", "black");

// SELECTOR VARIABLES FOR HTML ELEMENTS
const container = document.querySelector("#canvas-container"); // The container for the canvas
const resolutionSlider = document.querySelector("#resolution-slider"); // The slider which sets the resolution of the grid
const resolutionDisplay = document.querySelector("#resolution-display"); // The element that displays in realtime the current resolution set by the slider
const eyedropperModal = document.querySelector("#eyedropper-modal");
const activeColorDisplay = document.querySelector("#active-color");
const gridToggle = document.querySelector("#toggle-grid");
const colorDisplayRGB = document.querySelector("#color-name-rgb");
const colorDisplayHex = document.querySelector("#color-name-hex");

// ---------- FUNCTIONS ----------

// For tracking if the mouse is pressed down
document.onmousedown = () => (mouseIsPressed = true);
document.onmouseup = () => (mouseIsPressed = false);

// This function creates the drawing canvas by generating a specified number of divs and appending them into the canvas container.
function createCanvas(resolution) {
  // To arrange the divs into a nice and even grid, 'CSS Grid' is used.
  // Accordingly, we need to set grid dimensions that are appropriate to the intended resolution.
  container.style.gridTemplateColumns = `repeat(${resolution}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${resolution}, 1fr)`;

  // Next, using a loop we create each individual cell, add the 'canvas-cell' class and some event listeners to it and then append the cell to the canvas container.
  for (let i = 0; i < resolution ** 2; i++) {
    const newCell = document.createElement("div");
    newCell.classList.add("canvas-cell");
    newCell.setAttribute("id", `${i}`); // Give each cell its own id number to make the paint bucket tool work
    newCell.addEventListener("mouseover", changeCellColor); // For drawing
    newCell.addEventListener("mousedown", changeCellColor); // This one is necessary so that the cell that is under the cursor when clicking the mouse is also colored
    newCell.addEventListener("mouseup", changeCellColor); // mouseup is used to switch from the eyedropper back to the drawing tool after releasing the mouse

    container.appendChild(newCell);
  }
}

// Initialization
function init() {
  resolution = 8; // set default canvas resolution to 16x16
  resolutionDisplay.textContent = `${resolution} x ${resolution}`; // Initializes the RESOLUTION DISPLAY to the default resolution value
  createCanvas(resolution); // create canvas with the default resolution of 16x16
}

function eyedropper(e) {
  let pickedColor = window.getComputedStyle(e.currentTarget).getPropertyValue("background-color"); //gets the color of the div that is currently under the cursor
  joe.set(pickedColor); // set colorpicker to picked color
  activeColor = pickedColor;
}

// -------------PAINT BUCKET TOOL----------------

function paintBucket(cell, oldColor, newColor, rowLength) {
  let cellId = Number(cell);

  document.getElementById(`${cellId}`).style.backgroundColor = newColor; // the first clicked cell gets colored no matter what

  let aboveExists = false;
  let belowExists = false;
  let leftExists = false;
  let rightExists = false;

  if (cellId - rowLength >= 0) aboveExists = true;
  if (cellId + rowLength < rowLength ** 2) belowExists = true;
  if (cellId % rowLength != 0) leftExists = true;
  if ((cellId + 1) % rowLength != 0) rightExists = true;

  if (!aboveExists && !belowExists && !leftExists && !rightExists) return;

  // THE UPPER CELL
  if (aboveExists && document.getElementById(`${cellId - rowLength}`).style.backgroundColor === oldColor) {
    document.getElementById(`${cellId - rowLength}`).style.backgroundColor = newColor;
    paintBucket(cellId - rowLength, oldColor, newColor);
  }
  // THE LOWER CELL
  if (belowExists && document.getElementById(`${cellId + rowLength}`).style.backgroundColor === oldColor) {
    document.getElementById(`${cellId + rowLength}`).style.backgroundColor = newColor;
    paintBucket(cellId + rowLength, oldColor, newColor);
  }
  // THE LEFT CELL
  if (leftExists && document.getElementById(`${cellId - 1}`).style.backgroundColor === oldColor) {
    document.getElementById(`${cellId - 1}`).style.backgroundColor = newColor;
    paintBucket(cellId - 1, oldColor, newColor);
  }
  // THE RIGHT CELL
  if (rightExists && document.getElementById(`${cellId + 1}`).style.backgroundColor === oldColor) {
    document.getElementById(`${cellId + 1}`).style.backgroundColor = newColor;
    paintBucket(cellId + 1, oldColor, newColor);
  }
}

// This functions is responsible for coloring the canvas cells when the mouse is pressed down
function changeCellColor(e) {
  if (e.type === "mouseover" && mouseIsPressed) {
    if (activeTool === "pencil" || activeTool === "eraser") e.target.style.backgroundColor = activeColor;
    if (activeTool === "eyedropper") eyedropper(e);
  }
  if (e.type === "mousedown") {
    if (activeTool === "pencil" || activeTool === "eraser") e.target.style.backgroundColor = activeColor; // Only using 'mouseover' will miss the very first cell, so 'mousedown' is necessary as well
    if (activeTool === "eyedropper") eyedropper(e);
    if (activeTool === "bucket") paintBucket(e.target.id, document.getElementById(e.target.id).style.backgroundColor, activeColor, resolution);
  }
  if (e.type === "mouseup" && activeTool === "eyedropper") {
    activeTool = "pencil"; //
    activeColorDisplay.style.backgroundColor = activeColor;
  }
}

// Resetting the canvas
function resetCanvas() {
  let canvasCells = document.querySelectorAll(".canvas-cell");
  canvasCells.forEach((cell) => (cell.style.backgroundColor = "white"));
}

function deleteAllCells() {
  // document.querySelectorAll(".canvas-cell").forEach((cell) => cell.remove());
  container.innerHTML = "";
}

// ---------- RESOLUTION SLIDER FUNCTIONALITY ----------

// Listens to the resolution slider. If it is moved, it updates the 'resolution' variable to the new value and also updates the onscreen resolution display accordingly.
// This listener is set to "oninput", meaning the display will update IN REALTIME.
resolutionSlider.oninput = function () {
  resolution = this.value;
  resolutionDisplay.textContent = `${resolution} x ${resolution}`;
};

// Also listens to the resolution slider and updates the actual canvas resolution accordingly.
// To avoid bad performance and lag, which will occur when the resolution is updated with each new value, this is achieved with "onchange", which will only update once the mouse is released.
resolutionSlider.onchange = function () {
  deleteAllCells();
  createCanvas(resolution);
  resetCanvas();
};

init();

// ---------- BUTTONS ----------

// "Reset Canvas" button
document.querySelector("#btn-reset-canvas").onclick = resetCanvas;

// Set "activeTool" to whatever tool button has been pressed
document.querySelector("#btn-draw").addEventListener("click", pencilTool);
document.querySelector("#btn-eyedropper").addEventListener("click", () => (activeTool = "eyedropper"));
document.querySelector("#btn-bucket").addEventListener("click", () => (activeTool = "bucket"));

// Eraser button
document.querySelector("#btn-eraser").addEventListener("click", eraser);

function pencilTool() {
  activeTool = "pencil";
  if (lastUsedColor) activeColor = lastUsedColor;
}

function eraser() {
  activeTool = "eraser";
  lastUsedColor = activeColor;
  activeColor = "rgb(255,255,255)"; // set active color to white
}

// ---------- COLOR PICKER ----------

joe.show();
joe.on("done", (color) => changedColor(color)); // Once you've seleted a color with the picker, set activeColor to said color

function changedColor(color) {
  activeColor = color.css(); // Set the active color to the one you chose in the color picker
  activeTool = "pencil"; // Set active tool to pencil (if you're currently in eraser mode and switch color, it switches you automatically to pencil mode)
  activeColorDisplay.style.backgroundColor = activeColor;
  colorDisplayRGB.innerText = color.css();
  colorDisplayHex.innerText = color.hex();
}

// ---------- EYE DROPPER TOOL ----------
container.addEventListener("mousedown", eyedropperPreview);
container.addEventListener("mouseup", eyedropperPreview);
container.addEventListener("mousemove", eyedropperPreview);

function eyedropperPreview(e) {
  if (activeTool === "eyedropper" && mouseIsPressed === true) {
    mousePos.x = e.pageX + 20;
    mousePos.y = e.pageY + 20;
    eyedropperModal.style.left = `${mousePos.x}px`;
    eyedropperModal.style.top = `${mousePos.y}px`;
    eyedropperModal.style.backgroundColor = activeColor;

    if (e.type === "mousedown" || e.type === "mousemove") {
      eyedropperModal.style.display = "block";
    } else if (e.type === "mouseup") eyedropperModal.style.display = "none";
  } else {
    eyedropperModal.style.display = "none";
  }
}

// ------------- GRID LINES FOR CANVAS ----------------
const canvasCells = document.querySelectorAll(".canvas-cell");

// Turn grid lines on
function gridOn(resolution) {
  const borderStyle = "1px solid rgb(200, 200, 200)";
  // All rows except the last one
  for (let j = 0; j < resolution - 1; j++) {
    for (let i = 0 + resolution * j; i < resolution + resolution * j - 1; i++) {
      canvasCells[i].style.borderRight = borderStyle;
      canvasCells[i].style.borderBottom = borderStyle;
    }
    canvasCells[resolution + resolution * j - 1].style.borderBottom = borderStyle;
  }

  // The last row
  for (let i = resolution * (resolution - 1); i < resolution * resolution - 1; i++) {
    canvasCells[i].style.borderRight = borderStyle;
  }
}

// Turn grid lines off
function gridOff() {
  canvasCells.forEach((cell) => (cell.style.border = "none"));
}

function toggleGrid() {
  if (gridIsActive) {
    gridOff();
    gridIsActive = false;
  } else {
    gridOn(resolution);
    gridIsActive = true;
  }
}

gridToggle.addEventListener("click", toggleGrid);

// -------------TESTING AREA----------------
