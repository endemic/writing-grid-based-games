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

<simple example images follow>


```javascript
class Game extends Grid {
  constructor() {
    const rows = 10;
    const columns = 10;

    super(rows, columns);

    // can't access `this` until after calling parent constructor
    this.mineCount = 10;

    // our grid contains simple integers to represent game objects;
    // this map translates the numbers to a string, that can then be used as
    // human-readable reference or CSS class (for display purposes)
    this.cssClassMap = {
        0: 'empty',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'eight',
        9: 'unknown',
        10: 'flag',
        11: 'mine',
        12: 'exploded',
        13: 'marked',
        14: 'success'
    };

    // Set up grid that persists state of mines/clues
    this.mineGrid = Array(columns).fill().map(_ => Array(rows).fill());

    // bind context variable to the current Game() object
    // for each of these global handlers/interval
    const grid = document.querySelector('#grid');

    grid.addEventListener('mousedown', this.onMouseDown.bind(this));
    grid.addEventListener('mouseup', this.onMouseUp.bind(this));

    // prevent right-click context menu on the game board
    grid.addEventListener('contextmenu', e => e.preventDefault());

    // set up initial game state
    this.reset();
  }

  reset() {
    let nextState = this.currentState;

    // set initial background
    nextState = this.fill(nextState, UNKNOWN);

    // do initial draw
    this.update(nextState);

    // reset state of mines
    this.mineGrid = this.fill(this.mineGrid, EMPTY);

    let placedMines = 0;
    while (placedMines < this.mineCount) {
      let point = this.randomPoint();

      if (this.mineGrid[point.x][point.y] === EMPTY) {
        this.mineGrid[point.x][point.y] = MINE;
        placedMines += 1;
      }
    }

    // Set up hints by checking the 8 adjacent spaces
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.columns; x += 1) {

        // Don't overwrite mines
        if (this.mineGrid[x][y] === MINE) {
            continue;
        }

        // Find the number of mines contained in neighboring cells
        let hint = this.getNeighbors(x, y).filter(({ x, y }) => this.mineGrid[x][y] === MINE).length;

        this.mineGrid[x][y] = hint;
      }
    }

    // debug -- display contents of mineGrid (mines/hints)
    // this.render(this.mineGrid);
  }
}
```
