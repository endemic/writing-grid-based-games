---
layout: post
status: draft
title: The Grid
author:
  display_name: Nathan
  email: n@demick.org
date: 2023-09-11 10:21:38 -0400
categories:
- games
comments: []
---

https://www.youtube.com/watch?v=4-J4duzP8Ng

Detail the class that all games in the book will be based on


```javascript
class Grid {
  // our grid (2D array) will contain simple integers to represent game objects;
  // this map translates those numbers to a string, which can then be used as
  // human-readable reference or CSS class (for display purposes)
  cssClassMap = {};

  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    // set up 2D array to use as data store for game logic & display
    this.state = Array(columns).fill().map(_ => Array(rows).fill());

    // set up another 2D array to store references to DOM nodes (the actual HTML in the web page)
    this.gridRef = Array(columns).fill().map(_ => Array(rows).fill());

    let grid = document.querySelector('#grid');

    // set appropriate CSS rules
    grid.style.display = 'grid';
    grid.style.gridTemplateRows = `repeat(${rows}, auto)`;
    grid.style.gridTemplateColumns = `repeat(${columns}, auto)`;
    grid.style.aspectRatio = columns / rows;

    // create the grid in our HTML page
    for (let x = 0; x < this.columns; x += 1) {
      for (let y = 0; y < this.rows; y += 1) {
        // create a DOM node for each element in the backing array
        let node = document.createElement('div');

        // For games that use the mouse, set `data-` attributes
        // to easily reference the clicked node
        node.dataset.x = x;
        node.dataset.y = y;

        // save a reference to the node, so it can be quickly updated later
        this.gridRef[x][y] = node;

        // add the node to the actual page
        grid.appendChild(node);
      }
    }
  }

  update(nextState) {
    // enumerate through the current/new state arrays to update the changed values
    for (let x = 0; x < this.columns; x += 1) {
      for (let y = 0; y < this.rows; y += 1) {
        // if no changes, continue to the next cell
        if (this.state[x][y] === nextState[x][y]) {
          continue;
        }

        // update the CSS class of the cell 
        this.gridRef[x][y].classList = this.cssClassMap[nextState[x][y]];
      }
    }

    // set the next state as current state
    this.state = nextState;
  }

  // Returns a deep copy of the current state
  get currentState() {
    return JSON.parse(JSON.stringify(this.state));
  }

  // helper method to quickly fill a 2D array
  fill(grid, value) {
    return grid.map(row => row.fill(value));
  }

  // helper method to generate a random (x,y) point in the grid
  randomPoint() {
    return {
      x: Math.floor(Math.random() * this.columns),
      y: Math.floor(Math.random() * this.rows)
    };
  }
}
```
