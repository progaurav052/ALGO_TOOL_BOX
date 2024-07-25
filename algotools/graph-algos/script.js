const rows = 10;
const cols = 10;
let grid = [];
let startNode = [0, 0];
let endNode = [rows - 1, cols - 1];
const delay = 100;


function createGrid() {
  const gridContainer = document.getElementById('grid');
  for (let i = 0; i < rows; i++) {
    grid[i] = [];
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = `${i}-${j}`;
      grid[i][j] = { row: i, col: j, element: cell };
      gridContainer.appendChild(cell);
    }
  }
  grid[startNode[0]][startNode[1]].element.classList.add('start');
  grid[endNode[0]][endNode[1]].element.classList.add('end');
}


function markCell(cell, className) {
  return new Promise(resolve => {
    setTimeout(() => {
      cell.element.classList.add(className);
      resolve();
    }, delay);
  });
}

// DFS Implementation
async function dfs(node, visited = new Set()) {
  const [row, col] = node;
  if (row < 0 || row >= rows || col < 0 || col >= cols) return;
  if (visited.has(`${row}-${col}`) || grid[row][col].element.classList.contains('visited')) return;

  visited.add(`${row}-${col}`);
  await markCell(grid[row][col], 'visited');
  if (row === endNode[0] && col === endNode[1]) return;

  await dfs([row + 1, col], visited);
  await dfs([row - 1, col], visited);
  await dfs([row, col + 1], visited);
  await dfs([row, col - 1], visited);
}

function runDFS() {
  resetGrid();
  dfs(startNode);
}

// BFS Implementation
async function bfs() {
  const queue = [startNode];
  const visited = new Set();
  visited.add(`${startNode[0]}-${startNode[1]}`);

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    await markCell(grid[row][col], 'visited');

    if (row === endNode[0] && col === endNode[1]) return;

    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !visited.has(`${newRow}-${newCol}`)) {
        queue.push([newRow, newCol]);
        visited.add(`${newRow}-${newCol}`);
      }
    }
  }
}

function runBFS() {
  resetGrid();
  bfs();
}

// Dijkstra's Implementation
async function dijkstra() {
  const distances = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  distances[startNode[0]][startNode[1]] = 0;
  const pq = [[0, startNode]]; // [distance, [row, col]]
  const visited = new Set();

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [dist, [row, col]] = pq.shift();
    if (visited.has(`${row}-${col}`)) continue;
    visited.add(`${row}-${col}`);
    await markCell(grid[row][col], 'visited');

    if (row === endNode[0] && col === endNode[1]) return;

    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        const newDist = dist + 1; 
        if (newDist < distances[newRow][newCol]) {
          distances[newRow][newCol] = newDist;
          pq.push([newDist, [newRow, newCol]]);
        }
      }
    }
  }
}

function runDijkstra() {
  resetGrid();
  dijkstra();
}

function resetGrid() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].element.className = 'cell';
      }
    }
    grid[startNode[0]][startNode[1]].element.classList.add('start');
    grid[endNode[0]][endNode[1]].element.classList.add('end');
  }
  
  createGrid();
