---
layout: post
status: draft
title: "Grid-based game tutorial: Minesweeper"
author:
  display_name: Nathan
  email: n@demick.org
date: 2023-09-11 10:21:38 -0400
categories:
- games
comments: []
---
One of the classic time-wasting games that lots of people have fond memories of is Minesweeper; particularly the [Microsoft version](https://en.wikipedia.org/wiki/Microsoft_Minesweeper). Since it was included in Windows 3.1, it was one of those games that you could always count on when you might have access to an unfamiliar PC. Although, I have a personal confession: I always played Solitaire or Hearts, rather than Minesweeper. I never took the time to really learn how to play the game! Nevertheless, Minesweeper is a classic example of a grid-based game, and one that is a great candidate for re-implementing yourself.

As far as the rules go, the game is actually pretty simple. You've got a grid, with randomly placed "mines." The mines are hidden by an overlay. Clicking one of the hidden grid cells will reveal what's underneath. If it's a mine, you lose. If it's a number, that means there are that many mines in the eight neighboring spaces. If it's blank, then all neighboring blank spaces are revealed. The gist is to try to reveal the game state by logically using the clues.

```
[1][1][1][ ][ ]
[1][*][2][ ][ ]
[1][2][*][1][ ]
[ ][1][1][2][1]
[ ][ ][ ][1][*]
```

```javascript
const init = () => {
  // change these values to make a larger/smaller game board
  const rows = 10;
  const columns = 10;

  // more mines == harder
  const mineCount = 10;

  Grid.init(rows, columns);

  // in this game we have two grids -- one to display the game board, and one for the mines/hints
  const mineState = Grid.fill(Grid.displayStateCopy, 'empty');

  // initialize the mines/hints board first
  let placedMines = 0;
  while (placedMines < mineCount) {
    // put mines randomly within the `mineState` array
    const {x, y} = Grid.randomPoint;

    if (mineState[x][y] === 'empty') {
      mineState[x][y] = 'mine';
      placedMines += 1;
    }
  }

  // Go through the `mineState` array a second time, in order
  // to insert numeric hint values; for each (x, y) position,
  // check the 8 surrounding grid cells
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {

      // Skip cells that contain mines
      if (mineState[x][y] === 'mine') {
          continue;
      }

      // Find the number of mines contained in neighboring cells
      let hint = Grid.getNeighbors({ x, y })                           // gets all valid, in-bounds (x, y) positions of neighbors
                     .filter(({ x, y }) => mineState[x][y] === 'mine') // keep the (x, y) values that represent mines
                     .length;                                          // count how many there are

      // now we can display that number; represents how many mines surround the square
      mineState[x][y] = hint;
    }
  }

  // the game board will be initialized with all cells as "unknown", as the player hasn't revealed any cells yet
  const displayState = Grid.fill(Grid.displayStateCopy, 'unknown');

  // do initial update to show all cells as "unknown"
  Grid.update(displayState);

  // DEBUG -- this will display the contents of the mine/hint grid
  // Grid.update(mineState);

  Grid.onPointDown(onDown);
  Grid.onPointUp(onUp);

  // prevent right-click context menu on the game board
  document.querySelector('#grid').addEventListener('contextmenu', e => e.preventDefault());
```
