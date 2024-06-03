---
layout: post
status: draft
title: "Grid-based game tutorial: Snake"
author:
  display_name: Nathan
  email: n@demick.org
date: 2023-09-11 10:21:38 -0400
categories:
- games
comments: []
---
https://en.wikipedia.org/wiki/Snake_(video_game_genre)

One classic genre for casual games is named, appropriately, "Snake." The basic idea of these sorts of games is that you control a snake, which gets ever longer. The challenge being that in order to score points, you move the snake across "apples" (or mice, or whatever) that increase the snake's length. The snake continually moves in whatever direction it is facing, and if the head touches any part of the body, you lose.

This sort of game is perfect for a grid; each "segment" of the snake's body can be represented by a grid cell. In this version, the "snake" object consists of an array of points, represented by Cartesian coordinates. The snake can then be moved one square at a time by inserting a new set of coordinates as the first element of the array, and popping the last set of coordinates off the end of the array.

The initial game setup is fairly basic. 

```javascript
class Snake extends Grid {
  constructor() {
    const rows = 50;
    const columns = 50;
    super(rows, columns);

    let nextState = this.currentState;

    // use the built-in `fill` method for initial empty background
    nextState = this.fill(nextState, 'empty');

    // Set up the "snake" object -- each {x, y} object is a segment of the snake
    this.snake = [
        { x: 25, y: 25 }, // this is the "head" of the snake
        { x: 24, y: 25 },
        { x: 23, y: 25 },
        { x: 22, y: 25 }
    ];

    // Update the correct grid cells with the snake's body
    for (const {x, y} of this.snake) {
      nextState[x][y] = 'snake';
    }

    // do initial update, which draws the background & snake
    this.updateState(nextState);
  }
}
```

Add the following style rules to `main.css`, in order to represent the game background and the snake.

```css
.empty { background: black; }
.snake { background: limegreen; }
```

Load `index.html` in a browser and you should see a 50x50 grid, with a green "snake" in the center. Jawesome!

Now that the basics are in place, next step is to get the snake a-movin'. Since the snake is supposed to continually move forward (even without player input), we'll need some sort of function that is called every few milliseconds that runs code to update the snake's position. One way to regularly have a function called in JavaScript is using the global `setInterval(callback, milliseconds)` method, which runs `callback` every `milliseconds` ms. `setInterval` isn't precise; the duration of time between callbacks running can vary based on various circumstances, but it's fine for our purposes.

In the class `constructor` method, add this line which runs `update` every 30ms:

```javascript
  window.setInterval(() => this.update(), 30);
```

Now that we've referenced the `update` function, we actually have to write it.

```javascript
update() {
  let nextState = this.currentState;

  // clear the current snake position
  for (const {x, y} of this.snake) {
    nextState[x][y] = 'empty';
  }

  // determine the next place the snake will move to
  let currentSnakeHead = this.snake[0];
  let nextSnakeHead = {
    x: currentSnakeHead.x,
    y: currentSnakeHead.y
  };
  
  // for now, it will always move to the right
  nextSnakeHead.x += 1;

  // this check will "wrap" the snake around the screen
  if (nextSnakeHead.x >= this.columns) {
    nextSnakeHead.x = 0;
  }

  // `unshift` pushes an element on to the front of an array,
  // making it the new [0] element
  this.snake.unshift(nextSnakeHead);

  // pop off the last tail segment
  this.snake.pop();

  // re-draw the snake
  for (const {x, y} of this.snake) {
    nextState[x][y] = 'snake';
  }

  this.updateState(nextState);
}
```

Save the game source file and reload the page; you should see the snake continually moving from left to right.

Nice! We've gone from static to dynamic &mdash; and the next step is to add interactivity. For simplicity's sake, we'll focus on using a keyboard for user input; touch controls will be left as an exercise for the reader. Similarly to how we called a global JavaScript method (`window.setInterval`) to regularly update the game display, we'll call another global method to detect key presses. In the `constructor` function, write this line to add an "event listener" to the page:

```javascript
window.addEventListener('keydown', event => this.onKeyDown(event));
```

As you might expect, this line will make our game page detect any keyboard input, and send the details of that event to the `onKeyDown` method. Each time a key is pressed, an `event` object is generated and passed to our function that handles input; we can inspect that object to determine which key was pressed, and then execute the appropriate game logic. The next step is to write the `onKeyDown` method.

```javascript
onKeyDown(event) {
  // stop the page from doing anything else with this input
  event.preventDefault();

  console.log(`You pressed the ${event.key} key!`);
}
```

Reload the page and mash the keyboard. You should see a cacaphony of log messages show up in the developer console. This lets you know that the keyboard input handler actually works. Now we need to add logic that actually changes the direction the snek is moving. We didn't initially build in that capability, so we have to go back in and update the object that represents the snake. Instead of being just an array of coordinates, the snake will also store data about the next point it will move to. Rewrite the declaration of the `this.snake` instance variable that is defined in the `constructor` function:

```javascript
// Get rid of this
// this.snake = [
//     { x: 25, y: 25 },
//     { x: 24, y: 25 },
//     { x: 23, y: 25 },
//     { x: 22, y: 25 }
// ];

// Add this
this.snake = {
  position: [
    { x: 25, y: 25 }, // this is the "head" of the snake
    { x: 24, y: 25 },
    { x: 23, y: 25 },
    { x: 22, y: 25 }
  ],
  next: { x: 1, y: 0 }
}
```

Now the snake has both a `position` property, which stores its segment locations, as well as a `next` property, which shows the direction it is moving in. As a default, we're having it move to the right (x + 1), just as it was doing previously. The code that draws the snake also has to change slightly, by referencing the `position` array:

```javascript
// draw the snaaake
for (const {x, y} of this.snake.position) {
  nextState[x][y] = 'snake';
}
```

The `update` function will also need to be tweaked to reference the updated `this.snake` structure:

```javascript
update() {
  let nextState = this.currentState;

  // clear the current snake position
  for (const {x, y} of this.snake.position) {
    nextState[x][y] = 'empty';
  }

  // determine the next place the snake will move to
  let currentSnakeHead = this.snake.position[0];
  let nextSnakeHead = {
    x: currentSnakeHead.x + this.snake.next.x,
    y: currentSnakeHead.y + this.snake.next.y
  };

  // this check will "wrap" the snake around the screen
  if (nextSnakeHead.x >= this.columns) {
    nextSnakeHead.x = 0;
  } else if (nextSnakeHead.x < 0) {
    nextSnakeHead.x = this.columns - 1;
  }

  // push new snake head on to the body
  this.snake.unshift(nextSnakeHead);

  // pop off the last tail segment
  this.snake.pop();

  // re-draw the snake
  for (const {x, y} of this.snake.position) {
    nextState[x][y] = 'snake';
  }

  this.updateState(nextState);
}
```
