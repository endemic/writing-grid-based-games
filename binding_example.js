class NotBoundCallback {
  constructor() {
    this.message = "Hello, world!";
	  this.interval = setInterval(this.printMessage, 1000);
  }
  printMessage() {
    console.log(this.message);
    console.log(`this is ${this}`);
  }
  toString() {
    return "NotBoundCallback";
  }
  stop() {
    clearInterval(this.interval);
  }
}

class BoundCallback {
  constructor() {
    this.message = "Hello, world!";
	  this.interval = setInterval(this.printMessage.bind(this), 1000);
  }
  printMessage() {
    console.log(this.message);
    console.log(`this is ${this}`);
  }
  toString() {
    return "BoundCallback";
  }
  stop() {
    clearInterval(this.interval);
  }
}

let notBound = new NotBoundCallback();
notBound.stop();

let bound = new BoundCallback();
bound.stop();
