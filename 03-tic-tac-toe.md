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

First, download GridJS, which includes an `index.html` file that automatically loads the necessary JavaScript and CSS files. Next, open the `game.js` file in a text editor; you'll see that there is some example code there already which initializes a 10x10 grid, and sets up a simple event listener to toggle grid cell background colors. The first thing we can do is change the grid size to a 3x3 board.

<pre><code class="language-diff-javascript diff-highlight">- const rows = 10;
- const columns = 10;
+ const rows = 3;
+ const columns = 3;

Grid.init(rows, columns);</code></pre>

For this version of the game, we'll keep things simple &mdash; on an empty game board, the first click (or tap) on an empty square will place an _X_, the second will place an _O_, and so on. The example code already has set up a `click` event listener on the game board that gets the Cartesian coordinates (x, y) of the clicked space. We can modify this code slightly to place _X_ and _O_ graphics.

<pre><code class="language-diff-javascript diff-highlight">Grid.init(rows, columns);

+ // start by placing "X"
+ let player = 'x';

Grid.onPointDown(({ x, y }) => {
-   console.debug(`clicked grid cell (${x}, ${y})`);

-   /* replace this with your own code! */
  const nextState = Grid.currentState;

+   // do nothing if a player clicks on a square that's already filled
+   if (!Grid.isEmpty(nextState[x][y])) {
+     return;
+   }
+   
+   nextState[x][y] = player;

-   if (Grid.isEmpty(nextState[x][y])) {
-      nextState[x][y] = 'highlight';
-   } else {
-     nextState[x][y] = '';
-   }

-   if (Grid.isEmpty(nextState[x][y])) {
-     nextState[x][y] = player;
-   }

  Grid.update(nextState);
});</code></pre>

If you save the `game.js` file and load `index.html` in a browser (`File &rarr; Open File &rarr; index.html`), you should see a 3x3 grid in the center of the page. However, clicking squares inside doesn't seem to do anything. That's because GridJS uses CSS classes to apply styling to each square. The page looks for a class style of `.x` inside of `main.css`, but it's not there. Let's add it now. Make your own graphic files to represent an _X_ and _O_, or else download some samples here. Then add the following at the bottom of `main.css`:

<pre><code class="language-diff-css diff-highlight">#grid {
  /* ... */

-  .highlight {
-    background-color: blueviolet;
-  }

+  .x { background: url('x.png') center/100%; }
+  .o { background: url('o.png') center/100%; }
}</code></pre>

These background rules specify the image file that should be used for the background, and that the image should be placed in the center of the element, and take up 100% of the available background space. Save and reload, then click the grid &mdash; you should start seeing _X_s appear. However, it't not actually a game of tic-tac-toe yet, since the second player needs to be able to add marks to the board. We can make this happen by toggling the value of the `player` variable between `x` and `o`. After the call to `Grid.update(nextState)`, add the following condition:

<pre><code class="language-diff-javascript diff-highlight">Grid.update(nextState);

+ // switch players
+ if (player === 'x') {
+   player = 'o';
+ } else {
+   player = 'x';
+ }</code></pre>

Now, when you click or tap an empty square, either an _X_ or _O_ will be placed there. We're getting close! The last part of the game is to check to see if a player has won, or whether it has ended in a tie. If we think about the grid in terms of Cartesian coordinates, it might look something like this:

```
(0, 0) | (1, 0) | (2, 0)
------------------------
(0, 1) | (1, 1) | (2, 1)
------------------------
(0, 2) | (1, 2) | (2, 2)
```

In total, there are eight ways to win: fill in a column (3), a row (3), or one of the diagonals (2). We can make a list of each of these valid win conditions, and then loop through the list, checking the value of each square in the grid.

<pre><code class="language-diff-javascript diff-highlight">Grid.update(nextState);

+ const winPositions = [
+   [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}], // row 1
+   [{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}], // row 2
+   [{x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}], // row 3
+ 
+   [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}], // column 1
+   [{x: 1, y: 0}, {x: 1, y: 1}, {x: 1, y: 2}], // column 2
+   [{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}], // column 3
+ 
+   [{x: 0, y: 0}, {x: 1, y: 1}, {x: 2, y: 2}], // diagonal 1
+   [{x: 0, y: 2}, {x: 1, y: 1}, {x: 2, y: 0}], // diagonal 2
+ ];
+ 
+ for (const group of winPositions) {
+   let winner;
+ 
+   if (group.every(square => nextState[square.x][square.y] === 'x')) {
+     winner = 'X';
+   } else if (group.every(square => nextState[square.x][square.y] === 'o')) {
+     winner = 'O';
+   }
+ 
+   if (winner) {
+     alert(`Player "${winner}" wins!`);
+   }
+ }

// switch players
if (player === 'x') {</code></pre>

Put this code block right before the condition that swaps player turns. This should correctly identify when one player has won.

There's another end game state, however, and that's when all squares in the board have been filled in &mdash; a tie game. Checking for this state is a bit easier than determining the "win" condition: we need to check each square in the board, and if each is filled (without a player having already won) then the game is tied.

<pre><code class="language-diff-javascript diff-highlight">  if (winner) {
    alert(`Player "${winner}" wins!`);
  }
}

+ // start with the assumption that all squares have been used
+ let tieGame = true;
+
+ for (let x = 0; x < columns; x += 1) {
+   for (let y = 0; y < rows; y += 1) {
+     // if we find any empty square, it means the game isn't over yet
+     if (Grid.isEmpty(nextState[x][y])) {
+       tieGame = false;
+     }
+   }
+ }
+
+ if (tieGame) {
+   alert('Tie game!');
+ }

// switch players
if (player === 'x') {</code></pre>

One last feature we can implement is a way to programatically reset the game, so that you can keep playing without reloading the page (which re-initializes all the JavaScript code). A way to do this is keep track of whether the game is considered "over" by using a boolean variable. The next time a player clicks on the game board after the game is over will trigger some code to reset the game. Add the boolean right after the local variable used to store the current player.

<pre><code class="language-diff-javascript diff-highlight">let player = 'x';
+ let gameOver = false;

Grid.onPointDown(({ x, y }) => {</code></pre>

We now need to set that variable to `true` if one player wins, or if the game is tied.

<pre><code class="language-diff-javascript diff-highlight">if (wonGame) {
  alert(`Player "${player}" wins!`);

+ gameOver = true;
}</code></pre>

<pre><code class="language-diff-javascript diff-highlight">if (tieGame) {
  alert('Tie game!');

+ gameOver = true;
}</code></pre>

Finally, add a block in the `onPointDown` handler to check if the game is over, and if so, reset.

<pre><code class="language-diff-javascript diff-highlight">Grid.onPointDown(({ x, y }) => {
+ if (gameOver) {
+   // reset the game
+   gameOver = false;
+   player = 'x';
+   Grid.fill('');
+   return;
+ }

  const nextState = Grid.currentState;</code></pre>

And that's it! You've created a version of tic-tac-toe that's playable via a web browser. If the game doesn't work as you expect, you can download the completed project source and compare with what you've written. This sets the stage for making more complicated games in the future.

### Postscript

You may notice that when an `alert` window pops up after clicking a square on the grid, you don't actually see the square update with an _X_ or _O_ until _after_ you click "OK." This is because `alert` windows stop any other code from running until it is dismissed. A dumb hack you can use to get around this is delay the `alert` until after existing code has been run, by using `setTimeout`:

<pre><code class="language-javascript">const delayedAlert = message => {
  setTimeout(() => {
    alert(message);
  }, 0);
};</code></pre>

Since the delay is `0`, the alert basically runs immediately, but it waits until any existing code is finished executing. Now replace all your calls to `alert` with `delayedAlert`, and you'll see the UI update before the alert message appears.
