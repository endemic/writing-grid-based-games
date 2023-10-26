class SwipeExample {
  constructor() {
    window.addEventListener('touchstart', event => this.onTouchStart(event));
    window.addEventListener('touchend', event => this.onTouchEnd(event));
  }

  onTouchStart(event) {
    // store where the player first touched the screen
    this.currentTouch = event.changedTouches[0];  // only care about the first touch
  }

  onTouchEnd(event) {
    // store local ref to last touch
    const endTouch = event.changedTouches[0];

    let xDiff = endTouch.clientX - this.currentTouch.clientX;
    let yDiff = endTouch.clientY - this.currentTouch.clientY;

    // user moved finger in mostly horizontal direction
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // user moved their finger right
      if (xDiff > 0) {
        console.log('right');
      } else {
        console.log('left');
      }
    // user moved finger in mostly vertical direction
    } else {
      // user moved their finger down
      if (yDiff > 0) {
        console.log('down');
      } else {
        console.log('up');
      }
    }
  }
}

class TapExample {
  constructor() {
    window.addEventListener('touchstart', event => this.onTouchStart(event));
  }

  onTouchStart(event) {
    let touch = event.changedTouches[0];

    // get center of screen
    // find angle of line
    // 315 <-> 45 = right
    // 45 <-> 135 = up
    // 135 <-> 225 = left
    // 225 <-> 315 = right

    // tan -> opposite / adjacent
    // Math.atan(ratio) -> returns radians
  }
}
