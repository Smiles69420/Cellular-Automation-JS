import './style.css'
import { resources } from './Resources';
import { GameLoop } from './GameLoop';
import { Sprite } from './Sprite';
import { Vector2 } from './Vector2';

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const wall = new Sprite({
  resource: resources.images.wall,
  frameSize: new Vector2(32,32),
})
const floor = new Sprite({
  resource: resources.images.floor,
  frameSize: new Vector2(32,32),
})

const map_h = 600
const map_w = 400

const update = () => {
  //Any Updating code
}
const make_noisegrid = (density) => {
  // Initialize a 2D array with dimensions 300x600
  const noise_grid = Array.from({ length: map_h }, () => Array(map_w).fill(0));
  
  // Loop through each cell in the grid
  for (let i = 0; i < map_h; i++) {
      for (let j = 0; j < map_w; j++) {
          // Generate a random value between 0 and 10
          const random = Math.random() * 100;
          // Assign value based on density
          noise_grid[i][j] = random > density ? 0 : 1;
      }
  }

  return noise_grid;
};


// Example usage:
const noiseGrid = make_noisegrid(55);

function apply_cellular_automation(grid, count) {
  const map_h = grid.length; // Height of the map
  const map_w = grid[0].length; // Width of the map

  for (let i = 0; i < count; i++) {
      const temp_grid = grid.map(row => [...row]); // Create a deep copy of the grid

      for (let j = 0; j < map_h; j++) {
          for (let k = 0; k < map_w; k++) {
              let neighbour_wallcount = 0;

              // Iterate through neighbors
              for (let y = j - 1; y <= j + 1; y++) {
                  for (let x = k - 1; x <= k + 1; x++) {
                      // Check boundary conditions
                      if (y >= 0 && y < map_h && x >= 0 && x < map_w) {
                          if (y !== j || x !== k) {
                              // Count walls (0 values)
                              if (temp_grid[y][x] === 0) {
                                  neighbour_wallcount++;
                              }
                          }
                      } else {
                          // Treat out-of-bounds cells as walls
                          neighbour_wallcount++;
                      }
                  }
              }

              if (neighbour_wallcount > 5) {
                grid[j][k] = 0; // Convert to wall
            } else if (neighbour_wallcount < 4) {
                grid[j][k] = 1; // Convert to empty space
            }
          }
      }
  }
}


apply_cellular_automation(noiseGrid, 3);

const draw = () => {
    for (let i = 0; i < map_h; i++) {
        for (let j = 0; j < map_w; j++) {
            const x = j; // Tile width
            const y = i; // Tile height
            if (noiseGrid[i][j] === 1) {
                wall.drawImage(ctx, x, y); // Draw wall at correct pixel position
            } else if (noiseGrid[i][j] === 0) {
                floor.drawImage(ctx, x, y); // Draw floor at correct pixel position
            }
        }
    }
};

const gameLoop = new GameLoop(update,draw);
gameLoop.start();