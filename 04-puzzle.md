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
If you've ever played around with [old versions of Mac OS](https://infinitemac.org/), you'll be familiar with the concept of "desk accessories." These were small programs that could run alongside the currently running main app (the original Mac OS could only run one program at a time). One of the desk accessories was an implementation of the classic "[15 puzzle](https://en.wikipedia.org/wiki/15_puzzle)", programmed by [Andy Hertzfeld](https://www.folklore.org/StoryView.py?project=Macintosh&story=Puzzle.txt). Another example of this type of puzzle is an [easter egg](https://finalfantasy.fandom.com/wiki/15_Puzzle) in the classic NES game, Final Fantasy.

This sort of game is a perfect candidate for a grid, and is an especially good one to start off with. The puzzle board can be represented as a 4x4 two-dimensional array, with each cell containing a value from 1 &mdash; 16 (16 being the "empty" space). The grid can be initialized randomly, then play occurs by clicking or tapping a tile that is next to the empty space. The tile then moves into the empty spot; continued interaction will (hopefully) order all the tiles.

Setup is simple: we have a list of strings that represent each tile, and randomly insert them into the 4x4 "state" array.

```javascript
const rows = 4;
const columns = 4;

Grid.init(rows, columns);

// allowed values in the grid
let tiles = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];

// set the initial state of the grid
let nextState = Grid.currentState;

for (let y = 0; y < rows; y += 1) {
  for (let x = 0; x < columns; x += 1) {
    // randomly populate
    const randomIndex = Math.floor(Math.random() * tiles.length);

    // remove the value from `tiles`, so it can't be used twice
    nextState[x][y] = tiles.splice(randomIndex, 1)[0];
  }
}

// update the game state
this.update(nextState);
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

After the initial game setup, add these lines:

```javascript
Grid.onPointDown(({ x, y } => {
  console.debug(`player pointed to ${x}, ${y}!`);
});
```




Now that we know what grid tile is being selected, we need to check the neighboring spaces in the grid to see if any of them are empty. For this type of game, we only have to check in the four cardinal directions, like so (imagine `x` is the clicked tile):

```
[ ][ ][ ][ ]
[ ][*][ ][ ]
[*][x][*][ ]
[ ][*][ ][ ]
```

Given coordinates `(x, y)`, we can get the values of these neighbors by using a data structure similar to the following:

```javascript
let neighbors = [
  { x: x, y: y - 1 }, // top
  { x: x - 1, y: y }, // left
  { x: x + 1, y: y }, // right
  { x: x, y: y + 1 }, // bottom
];
```

Remember that in our grid, the origin (0, 0) is the upper left corner, and the y-axis values increase as you go "down." We can extract this array to be returned from a new method, appropriately named `getNeighbors`. One addition is a call to `filter`, which is passed the `withinBounds` method ([defined in the parent `Grid` class](https://github.com/endemic/gridjs/blob/main/grid.js#L78-L80)) as an argument. This ensures that returned neighboring cells are all within the bounds of the grid.

```javascript
const getNeighbors = ({ x, y }) => {
  return [
      { x: x, y: y - 1 }, // top
      { x: x - 1, y: y }, // left
      { x: x + 1, y: y }, // right
      { x: x, y: y + 1 }, // bottom
  ].filter(Grid.withinBounds);
};
```

We can then update the `onPointDown` callback function to include the following logic, which checks the grid cells around where the user clicked, and if one is empty, swaps the two.

```javascript
let nextState = Grid.currentState;
let neighbors = getNeighbors({ x, y });

// check each neighboring cell
for (let i = 0; i < neighbors.length; i += 1) {
  let point = neighbors[i];

  if (nextState[point.x][point.y] === 'sixteen') {
    // if a neighboring cell is empty, swap it with the one that was clicked
    nextState[point.x][point.y] = nextState[clicked.x][clicked.y];
    nextState[clicked.x][clicked.y] = 'sixteen';

    // show the change
    Grid.update(nextState);

    // we don't need to check all the other neighbors
    // once we've found an empty cell, so can break out of the loop
    break;
  }
}
```

Save the `game.js` file and reload the page. You should now be able to click numbers next to the empty cell, and watch them move around. This is all the functionality that is required to successfully solve the puzzle! However, it would be nice to provide the player some sort of confirmation that they finished the game. To that end, we can write up a function that checks whether or not the contents of each grid cell is sorted. A quick way to do this is to make an array of strings &mdash; then compare the contents of each grid cell with the corresponding value of an incrementing index. For example, the cell at (0, 0) should be `one`, the cell at (1, 0) should be `two`, etc.

```javascript
const checkWin = () => {
  let state = Grid.currentState;
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
        console.debug(`${tiles[index]} is not in the right position`);
        return false;
      }

      index += 1;
    }
  }

  return true;
}
```

We can now use this method at the end of `onPointDown` to show an alert popup when the player solves the puzzle:

```javascript
if (checkWin()) {
  alert('Congratulations, you solved the puzzle!');
}
```

We now have a more-or-less completed puzzle game! If you're having problems, or the game isn't working as it should, download an example of the completed project to see what you might have missed.
