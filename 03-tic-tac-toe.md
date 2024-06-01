---
layout: post
status: draft
title: Tic Tac Toe
author:
  display_name: Nathan
  email: n@demick.org
date: 2023-09-11 10:21:38 -0400
categories:
- games
comments: []
---

One of the simplest games you can play on a grid is tic-tac-toe: mark spaces in a 3x3 grid with _X_ or _O_; the player who gets three in a row (horizontally, vertically, or diagonally) wins. Let's program a simple version of the game using GridJS. This will give a good introduction to some recurring concepts that you can use to build other games in the future.

First, download the GridJS source, which includes an `index.html` file that automatically loads the necessary JavaScript and CSS files. Next, open the `game.js` file in a text editor; you'll see that there is some example code there already which initializes a 10x10 grid, and sets up a simple event listener to toggle grid cell background colors. The first thing we can do is change the grid size to a 3x3 board.

```javascript
const rows = 3;
const columns = 3;
```

For this version of the game, we'll keep things simple &mdash; on an empty game board, the first click (or tap) on an empty square will place an _X_, the second will place an _O_, and so on. The example code already has set up a `click` event listener on the game board that gets the Cartesian coordinates (x, y) of the clicked space. We can modify this code slightly to place _X_ and _O_ graphics.

```javascript
// start by placing "X"
let player = 'x';

Grid.onPointDown(({ x, y }) => {
  const nextState = Grid.currentState;

  if (Grid.isEmpty(nextState[x][y])) {
    nextState[x][y] = player;
  }

  Grid.update(nextState);
});
```

If you save the `game.js` file and load `index.html` in a browser (`File &rarr; Open File &rarr; index.html`), you should see a 3x3 grid in the center of the page. However, clicking squares inside doesn't seem to do anything. That's because GridJS uses CSS classes to apply styling to each square. The page looks for a class style of `.x` inside of `main.css`, but it's not there. Let's add it now. Make your own graphic files to represent an _X_ and _O_, or else download some samples here. Then add the following at the bottom of `main.css`:

```css
#grid .x { background: url('x.png') center/100%; }
#grid .o { background: url('o.png') center/100%; }
```

These background rules specify the image file that should be used for the background, and that the image should be placed in the center of the element, and take up 100% of the available background space. Save and reload, then click the grid &mdash; you should start seeing _X_s appear. However, it't not actually a game of tic-tac-toe yet, since the second player needs to be able to add marks to the board. We can make this happen by toggling the value of the `player` variable between `x` and `o`. After the call to `Grid.update(nextState)`, add the following condition:

```javascript
if (player === 'x') {
  player = 'o';
} else {
  player = 'x';
}

// you could also do this using a "ternary" expression, if you want to be 💁‍♀️
// player = player === 'x' ? 'o' : 'x';
```

Now, when you click or tap an empty square, either an _X_ or _O_ will be placed there. We're getting close! The last part of the game is to check to see if a player has won, or whether it has ended in a tie. If we think about the grid in terms of Cartesian coordinates, it might look something like this:

```
(0, 0) | (1, 0) | (2, 0)
------------------------
(0, 1) | (1, 1) | (2, 1)
------------------------
(0, 2) | (1, 2) | (2, 2)
```

In total, there are eight ways to win: fill in a column (3), a row (3), or one of the diagonals (2). We can make a list of each of these valid win conditions, and then loop through the list, checking the value of each square in the grid.

```javascript
const winConditions = [
  [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}], // row 1
  [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}], // row 2
  [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}], // row 3

  [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}], // column 1
  [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}], // column 2
  [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}], // column 3

  [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}], // diagonal 1
  [{x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}], // diagonal 2
];

winConditions.forEach(group => {
  // use reduce here to get the winning player? or is that too complicated
});
```
