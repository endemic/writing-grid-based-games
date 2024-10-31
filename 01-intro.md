---
layout: post
status: draft
title: Grid-based browser games
author:
  display_name: Nathan
  email: n@demick.org
date: 2023-09-11 10:21:38 -0400
categories:
- games
comments: []
---
Ever since people have had access to computers, they have written games for them. I'm sure we could discuss at length the psychology of play, and why electronic games are so compelling. My own theory is that writing game programs fulfills an innate creative need for world-building. There's just _something_ about setting up rules for an interactive environment, and seeing the simulation conform to those rules, that gives one a sense of power and achievement. Game programming falls on the rebellious side of the dichotomy of computing; resources are used for whimsy and fun, as opposed to Serious Business and Making Money (although sometimes these ideas intersect).

The explosion in popularity of the [world wide web](https://en.wikipedia.org/wiki/World_Wide_Web) created a new platform for software, including games. Distribution was suddenly a lot easier: instead of having to copy a game with a floppy disk or CD, a player could download it. However, a few enterprising folks skipped the "download" part and made games playable directly in the browser. The first generation of these games were fairly primitive &mdash; data needed to be saved and displayed by a web server, which meant that play was very slow paced, more akin to interactive fiction &mdash; you make a choice in the game by clicking a link or button, then wait for the server to send you back an updated page. I played (and developed!) a number of games like this.

While clicking from page to page is servicable for documents and turn-based games, developers and users wanted more interactivity from the web. Various attempts were made to allow programs to be embedded within web pages, such as [Java applets](https://en.wikipedia.org/wiki/Java_applet) and [Flash](https://en.wikipedia.org/wiki/Adobe_Flash). The problem with these technologies was that they relied on the user installing additional 3rd party software on their computer, and in some cases presented security risks due to bugs. However, that didn't stop lots of folks from making games with them, especially Flash &mdash; if you're old enough, you might remember the heyday of sites like Newgrounds and Kongregate.

These 3rd party solutions to getting real-time interactivity (read: games) into the web started to become less popular as JavaScript became more standardized (and capable) across different browsers. The introduction of the `<canvas>` HTML element let developers draw graphics directly to a web page, without the user needing to install more programs. This was especially important for smartphones, as Mobile Safari never allowed browser plugins, and the Android version of Flash was a train wreck. With `<canvas>`, game developers can now make basically any sort of game imaginable, and have it embedded directly in a website.

My own journey making games for the web has vascillated between using `<canvas>` ([exhibit A](https://github.com/endemic/arcadia)) and old-fashioned HTML and CSS. While `<canvas>` is more like a "traditional" game development environment, using HTML &amp; CSS as the building blocks for a game has a few advantages:

1. If you have a background in web development, HTML &amp; CSS should be tools that you already know. Conversely, if you don't have prior experience, learning these tools has real-world benefits outside of game-making &mdash; for example, my day job is in web development, which includes laying out user interfaces using HTML/CSS.

2. Loading game resources can be handled by the browser. Define backgrounds for HTML elements in CSS, and the image files are loaded automatically.

3. CSS transforms and transitions can be used to move game objects, rather than needing to write (or import) your own tweening functions.

4. Event handling and collision detection can be done by the browser, without needing to write your own code.

The common thread that connects this list is laziness: writing less code means you can complete a project faster and with fewer bugs.

I'm basically all about the "low code" solution. 

why grid-based games?

1. many game programming concepts are easier with a grid
   a. collision detection is just checking if an (x,y) coord is truthy or falsey
   b. easy to update only the cells that have changed
   c. mouse/touch input is dead simple to map to a grid
   d. lots of games can be "deconstructed" to a grid
