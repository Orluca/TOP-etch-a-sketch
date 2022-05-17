"use strict";

// GENERAL VARIABLES
let resolution = 16; // Resolution of the canvas and the default value

// SELECTOR VARIABLES FOR HTML ELEMENTS
const container = document.querySelector("#canvas-container"); // The container for the canvas
const resolutionSlider = document.querySelector("#resolution-slider"); // The slider which sets the resolution of the grid
const resolutionDisplay = document.querySelector("#resolution-display"); // The element that displays in realtime the current resolution set by the slider

// FUNCTIONS

// This function creates the drawing canvas by generating a specified number of divs and appending them into the canvas container.
function createCanvas(resolution) {
  // To arrange the divs into a nice and even grid, 'CSS Grid' is used.
  // Accordingly, we need to set grid dimensions that are appropriate to the intended resolution.
  container.style.gridTemplateColumns = `repeat(${resolution}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${resolution}, 1fr)`;

  // Next, using a loop we create each individual cell, add the 'canvas-cell' class to it and then append the cell to the canvas container.
  for (let i = 0; i < resolution ** 2; i++) {
    const newDiv = document.createElement("div");
    newDiv.classList.add("canvas-cell");
    container.appendChild(newDiv);
  }
}

// Listens to the resolution slider. If it is moved, it updates the 'resolution' variable to the new value and also updates the resolution display accordingly.
// This listener is set to "oninput", meaning the display will update IN REALTIME.
resolutionSlider.oninput = function () {
  resolution = this.value;
  resolutionDisplay.textContent = `${resolution} x ${resolution}`;
};

// Also listens to the resolution slider and updates the actual canvas resolution accordingly.
// To avoid bad performance and lag, which will occur when the resolution is updated with each new value, this is achieved with "onchange", which will only update once the mouse is released.
resolutionSlider.onchange = function () {
  createCanvas(resolution);
};

// INITIALIZATIONS
function init() {
  resolutionDisplay.textContent = `${resolution} x ${resolution}`; // Initializes the RESOLUTION DISPLAY to the default resolution value
  createCanvas(resolution);
}

init();
