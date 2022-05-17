"use strict";

// VARIABLES FOR HTML ELEMENTS
const container = document.querySelector("#canvas-container");

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

createCanvas(16);
