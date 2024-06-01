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

<iframe width="560" height="315" src="https://www.youtube.com/embed/4-J4duzP8Ng?si=3Qj2QWbBB7KfKCHB" title="YouTube video player" frameborder="0" allow="encrypted-media; picture-in-picture" allowfullscreen></iframe>

The goal for this series of tutorials is to require minimal setup in order to get something displayed in a browser. When creating my own games, I found that there were a few pieces of functionality that were helpful to extract into a shared source file. In this case, it's represented as a JavaScript class, imaginatively named `Grid`. Extending your own game class with `Grid` will provide a few bits of functionality:

1. Finds an HTML element with the ID `#grid`, and fills it with the appropriate number of cells based on the row/column count you specify.
2. Sets CSS styles so that the `#grid` element actually uses [CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout) for layout. This ensures that the aspect ratio of each cell is correct, so they each look like a square.
3. Provides a `currentState` getter method which returns a 2D array of the state of the game. You can then make changes to this array (normally in response to player input) and use it as an argument for:
4. An `updateState` method which takes a 2D array as an argument (nominally obtained by getting `currentState` earlier), calculates the difference between the old/new state, and changes the rendered HTML/CSS in order to show game activity.

You totally don't have to understand the following code in order to use it. However, it has been annotated fairly heavily with comments, in order to hopefully explain what each line is doing. We'll see how the class is used in the following tutorials.


```javascript
class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;

    // set up 2D array to use as data store for game logic & display
    this.state = Array(columns).fill().map(_ => Array(rows).fill());

    // set up 2D array to store references to DOM nodes
    this.gridRef = Array(columns).fill().map(_ => Array(rows).fill());

    // the base HTML page needs to have an element with `id="grid"`
    const grid = document.querySelector('#grid');

    // set appropriate CSS rules
    grid.style.display = 'grid';
    grid.style.gridTemplateRows = `repeat(${rows}, auto)`;
    grid.style.gridTemplateColumns = `repeat(${columns}, auto)`;
    grid.style.aspectRatio = columns / rows;

    // fill the grid with `<div>` elements
    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.columns; x += 1) {
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

  updateState(nextState) {
    // enumerate through the current/new state arrays to update the changed values
    for (let x = 0; x < this.columns; x += 1) {
      for (let y = 0; y < this.rows; y += 1) {
        // if old state & new state are the same, nothing needs to be updated
        if (this.state[x][y] === nextState[x][y]) {
          continue;
        }

        // otherwise, update the CSS class of the grid cell
        this.gridRef[x][y].classList = nextState[x][y];
      }
    }

    // set the new current state
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

  // helper method to get a random point in the grid
  get randomPoint() {
    return {
      x: Math.floor(Math.random() * this.columns),
      y: Math.floor(Math.random() * this.rows)
    };
  }

  // helper method to determine if point is in grid
  withinBounds({ x, y }) {
    return x >= 0 && x < this.columns && y >= 0 && y < this.rows;
  }
}
```
