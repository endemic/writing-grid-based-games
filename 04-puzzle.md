---
layout: post
status: draft
title: "Grid-based game tutorial: Puzzle"
author:
  display_name: Nathan
  email: n@demick.org
date: 2023-09-11 10:21:38 -0400
categories:
- games
comments: []
---
If you've ever played around with old versions of Mac OS, you'll be familiar with the concept of "desk accessories." These were small programs that could run alongside the currently running main app (the original Mac OS could only run one program at a time). One of the desk accessories was an implementation of the classic "[15 puzzle](https://en.wikipedia.org/wiki/15_puzzle)", programmed by [Andy Hertzfeld](https://www.folklore.org/StoryView.py?project=Macintosh&story=Puzzle.txt). This type of puzzle was also been included as an [easter egg](https://finalfantasy.fandom.com/wiki/15_Puzzle) in the classic NES game, Final Fantasy.

This sort of game is a perfect candidate for a grid, and is an especially good one to start off with. The puzzle board can be represented as a 4x4 two-dimensional array, with each cell containing a value from 1 &mdash; 16 (16 being the "empty" space). The grid can be initialized randomly, then play occurs by clicking or tapping a tile that is next to the empty space. The tile then moves into the empty spot; continued interaction will (hopefully) order all the tiles.

Setup is simple: we have a list of strings that represent each tile, and randomly insert them into the 4x4 "state" array.

```javascript
class Game extends Grid {
  constructor() {
    super(rows = 4, columns = 4);

    // allowed values in the grid
    let tiles = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];

    // set the initial state of the grid
    let nextState = this.currentState;

    for (let y = 0; y < this.rows; y += 1) {
      for (let x = 0; x < this.columns; x += 1) {
        // randomly populate
        const randomIndex = Math.floor(Math.random() * tiles.length);

        // remove the value from `tiles`, so it can't be used twice
        nextState[x][y] = tiles.splice(randomIndex, 1)[0];
      }
    }

    // update the game state
    this.update(nextState);
  }
}
```

Add the following to your `main.css` stylesheet. These class names correspond with the values that are stored in the 2D array that represents the game, and allow granular control over background images. For example, you could use a "sprite sheet," which is using the same image for all the backgrounds, but specifying different regions for each tile. In this example we'll keep things simple by defining a separate image file for each tile. This CSS rule specifies the path of the image file, and that it should be centered in the HTML `<div>` and take up 100% of the available space.

```css
.one { background: url('../images/1.png') center/100%; }
.two { background: url('../images/2.png') center/100%; }
.three { background: url('../images/3.png') center/100%; }
.four { background: url('../images/4.png') center/100%; }
.five { background: url('../images/5.png') center/100%; }
.six { background: url('../images/6.png') center/100%; }
.seven { background: url('../images/7.png') center/100%; }
.eight { background: url('../images/8.png') center/100%; }
.nine { background: url('../images/9.png') center/100%; }
.ten { background: url('../images/10.png') center/100%; }
.eleven { background: url('../images/11.png') center/100%; }
.twelve { background: url('../images/12.png') center/100%; }
.thirteen { background: url('../images/13.png') center/100%; }
.fourteen { background: url('../images/14.png') center/100%; }
.fifteen { background: url('../images/15.png') center/100%; }
.sixteen { background: url('../images/empty.png') center/20%; }
```

Save the `game.js` and `main.css` files, and load the `index.html` file in your browser. You should see a 4x4 grid, filled with sixteen different tiles in randomized locations. Reload the page to make sure they change every time.

At this point, we've got the core of the game set up. A logical next step is to add support for user interaction. For HTML-based web games, this can be handled by a JavaScript event listener. Every interaction that a user does within the context of a web page (moving a mouse, clicking, tapping) can get a JavaScript function attached to it, so that game logic can be executed. In this case, we want to know when a player clicks (or taps) on the game grid; the idea being that if they tap on a tile that's next to the empty spot, the tapped tile moves.

In the `constructor` function of our `Game` class (where all the setup occurs), add these lines:

```javascript
// get a reference to the game grid
const grid = document.querySelector('#grid');

// any time the grid is clicked, run the `Game#onClick` method
// (touchscreens will emulate a "click" event)
grid.addEventListener('click', this.onClick.bind(this));
```

The first step in attaching an event listener is getting the area of the HTML document that we care about &mdash; in this case, the game grid. `grid.js` always identifies the grid with an ID, appropriately named `#grid`. Next, we call `addEventListener` on the grid, specifying what event we care about (`click`, which actually also works for touchscreens), as well as the code that should get run when the click event happens.

One confusing thing is the call to `bind` &mdash; what the hell is that doing? In effect, it's making the JavaScript class context variable (`this`) consistent in the `onClick` method. 

<-- digression about scope here -->

Now, `onClick` hasn't actually been written yet, so add a new method to the `Game` class named `onClick`. Functions that are callbacks for event handlers should take a single event object argument. The first thing we want to do in the handler is figure out what tile in the grid was actually clicked; then we can program the game logic that decides whether or not to move tiles around. Add the following `onClick` class method, save, reload the page, and click around on the grid tiles &mdash; you should see Cartesian coordinates representing the touched tile appear as log messages in the developer console.

```javascript
onClick(event) {
  // the grid is constructed so that each cell has a `data-x` and `data-y` attribute
  // this makes it easy to find which cell was clicked, by checking the event target
  // Read more at https://developer.mozilla.org/en-US/docs/Web/API/Event/target
  const clicked = {
      x: parseInt(event.target.dataset.x, 10),
      y: parseInt(event.target.dataset.y, 10)
  };

  console.log(clicked);
}
```

Now that we know what grid tile is being selected, we need to check the neighboring spaces in the grid to see if any of them are empty. For this type of game, we only have to check in the four cardinal directions, like so (imagine `x` is the clicked tile):

```
[ ][ ][ ][ ]
[ ][*][ ][ ]
[*][x][*][ ]
[ ][*][ ][ ]
```

Given coordinates `(x, y)`, we can get the coordinates of these neighbors by using a data structure similar to the following:

```javascript
let neighbors = [
  { x: x, y: y - 1 }, // top
  { x: x - 1, y: y }, // left
  { x: x + 1, y: y }, // right
  { x: x, y: y + 1 }, // bottom
];
```

Remember that in our grid, the origin (0, 0) is the upper left corner, and the y-axis values increase as you go "down."


```javascript
let nextState = this.currentState;
let neighbors = this.getNeighbors(clicked);

// check each neighboring cell
for (let i = 0; i < neighbors.length; i += 1) {
  let point = neighbors[i];

  if (nextState[point.x][point.y] === EMPTY) {
    // if a neighboring cell is empty, swap it with the one that was clicked
    nextState[point.x][point.y] = nextState[clicked.x][clicked.y];
    nextState[clicked.x][clicked.y] = EMPTY;

    // show the change
    this.update(nextState);

    // we don't need to check all the other neighbors
    // once we've found an empty cell, so can break out of the loop
    break;
  }
}
```

```javascript
const withinBounds = (x, y) => {
  return x >= 0 &&
    x < this.columns &&
    y >= 0 &&
    y < this.rows;
}
```

```javascript
getNeighbors({ x, y }) {
  // function to ensure that (x, y) coords are within our data structure
  const withinBounds = ({ x, y }) => x >= 0 && x < this.columns && y >= 0 && y < this.rows;

  return [
      // previous row
      { x: x, y: y - 1 },
      // current row
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      // next row
      { x: x, y: y + 1 },
  ].filter(withinBounds);
}
```

```javascript
checkWin() {
  let state = this.currentState;
  let tiles = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
  let index = 0;

  // iterate through the rows/columns and expect the
  // value of each cell to match the ordered `tiles` list
  // nest the x loop inside the y loop, so the grid can be traversed like this:
  // [ 1][ 2][ 3][ 4]
  // [ 5][ 6][ 7][ 8]
  // [ 9][10][11][12]
  // [13][14][15][16]
  for (let y = 0; y < this.rows; y += 1) {
    for (let x = 0; x < this.columns; x += 1) {
      if (state[x][y] !== tiles[index]) {
        console.log(`${tiles[index]} is not in the right position`);
        return false;
      }

      index += 1;
    }
  }

  return true;
}
```

https://github.com/endemic/tile-puzzle/blob/main/scripts/game.js
