"use strict";
// ---------- GENERAL VARIABLES ----------
let resolution; // Resolution of the canvas and the default value
let mouseIsPressed = false; // Tracks if the left mouse button is pressed down
let activeColor = "rgb(0, 0, 0)"; // Set default color to black
let activeTool = "pencil";
let mousePos = {};

const joe = colorjoe.rgb("colorjoe", "black", ["currentColor"]);

// SELECTOR VARIABLES FOR HTML ELEMENTS
const container = document.querySelector("#canvas-container"); // The container for the canvas
const resolutionSlider = document.querySelector("#resolution-slider"); // The slider which sets the resolution of the grid
const resolutionDisplay = document.querySelector("#resolution-display"); // The element that displays in realtime the current resolution set by the slider
const eyedropperModal = document.querySelector("#eyedropper-modal");

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
    newCell.addEventListener("mouseover", changeCellColor); // For drawing
    newCell.addEventListener("mousedown", changeCellColor); // This one is necessary so that the cell that is under the cursor when clicking the mouse is also colored
    newCell.addEventListener("mouseup", changeCellColor); // mouseup is used to switch from the eyedropper back to the drawing tool after releasing the mouse

    container.appendChild(newCell);
  }
}

// Initialization
function init() {
  resolution = 32; // set default canvas resolution to 16x16
  resolutionDisplay.textContent = `${resolution} x ${resolution}`; // Initializes the RESOLUTION DISPLAY to the default resolution value
  createCanvas(resolution); // create canvas with the default resolution of 16x16
}

function eyedropper(e) {
  let pickedColor = window.getComputedStyle(e.currentTarget).getPropertyValue("background-color");
  joe.set(pickedColor); // set colorpicker to picked color
  activeColor = pickedColor;
}

// This functions is responsible for coloring the canvas cells when the mouse is pressed down
function changeCellColor(e) {
  if (e.type === "mouseover" && mouseIsPressed) {
    if (activeTool === "pencil") e.target.style.backgroundColor = activeColor;
    if (activeTool === "eyedropper") eyedropper(e);
  }
  if (e.type === "mousedown") {
    if (activeTool === "pencil") e.target.style.backgroundColor = activeColor; // Only using 'mouseover' will miss the very first cell, so 'mousedown' is necessary as well
    if (activeTool === "eyedropper") eyedropper(e);
  }
  if (e.type === "mouseup" && activeTool === "eyedropper") activeTool = "pencil";
}

// Resetting the canvas
function resetCanvas() {
  let canvasCells = document.querySelectorAll(".canvas-cell");
  canvasCells.forEach((cell) => (cell.style.backgroundColor = "white"));
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
  createCanvas(resolution);
  resetCanvas();
};

init();

// ---------- BUTTONS ----------

// "Reset Canvas" button
document.querySelector("#btn-reset-canvas").onclick = resetCanvas;

// Set "activeTool" to whatever tool button has been pressed
document.querySelector("#btn-draw").addEventListener("click", () => (activeTool = "pencil"));
document.querySelector("#btn-eyedropper").addEventListener("click", () => (activeTool = "eyedropper"));
document.querySelector("#btn-rainbow").addEventListener("click", () => (activeTool = "rainbow"));

// ---------- COLOR PICKER ----------

joe.show();
joe.on("done", (color) => (activeColor = color.css())); // Once you've seleted a color with the picker, set activeColor to said color

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
// -------------TESTING AREA----------------
