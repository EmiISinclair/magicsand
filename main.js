// Create a 2D array filled with a default value
const make2DArray = (cols, rows, defaultValue = 0) =>
  Array.from({ length: cols }, () => Array(rows).fill(defaultValue));

// Global variables
let grid, velocityGrid;
let w = 5;
let cols, rows;
let hueValue = 200;
const gravity = 0.1;

// Check if a position is within grid bounds
const withinBounds = (x, y) => x >= 0 && x < cols && y >= 0 && y < rows;

function setup() {
  createCanvas(600, 500);
  colorMode(HSB, 360, 255, 255);
  cols = floor(width / w);
  rows = floor(height / w);
  grid = make2DArray(cols, rows);
  velocityGrid = make2DArray(cols, rows, 1);
}

function draw() {
  background(0);
  handleMouseInput();
  updateGrid();
  drawGrid();
}

function handleMouseInput() {
  if (mouseIsPressed) {
    const mouseCol = floor(mouseX / w);
    const mouseRow = floor(mouseY / w);
    const areaSize = 5;
    const offset = floor(areaSize / 2);

    for (let i = -offset; i <= offset; i++) {
      for (let j = -offset; j <= offset; j++) {
        if (random(1) < 0.75) {
          const col = mouseCol + i;
          const row = mouseRow + j;
          if (withinBounds(col, row)) {
            grid[col][row] = hueValue;
            velocityGrid[col][row] = 1;
          }
        }
      }
    }

    hueValue = (hueValue + 0.5) % 360 || 1;
  }
}

function drawGrid() {
  noStroke();
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (grid[i][j] > 0) {
        fill(grid[i][j], 255, 255);
        square(i * w, j * w, w);
      }
    }
  }
}

function updateGrid() {
  const nextGrid = make2DArray(cols, rows);
  const nextVelocityGrid = make2DArray(cols, rows);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const state = grid[i][j];
      const velocity = velocityGrid[i][j];
      if (state > 0) moveParticle(i, j, state, velocity, nextGrid, nextVelocityGrid);
    }
  }

  grid = nextGrid;
  velocityGrid = nextVelocityGrid;
}

function moveParticle(i, j, state, velocity, nextGrid, nextVelocityGrid) {
  let moved = false;
  const targetRow = min(j + floor(velocity), rows - 1);

  for (let y = targetRow; y > j; y--) {
    if (tryMove(i, y, state, velocity, nextGrid, nextVelocityGrid)) {
      moved = true;
      break;
    }
  }

  if (!moved) {
    nextGrid[i][j] = state;
    nextVelocityGrid[i][j] = velocity + gravity;
  }
}

function tryMove(i, y, state, velocity, nextGrid, nextVelocityGrid) {
  const directions = [0, random(1) < 0.5 ? 1 : -1, random(1) < 0.5 ? -1 : 1];

  for (const dir of directions) {
    const newI = i + dir;
    if (withinBounds(newI, y) && grid[newI][y] === 0) {
      nextGrid[newI][y] = state;
      nextVelocityGrid[newI][y] = velocity + gravity;
      return true;
    }
  }
  return false;
}
