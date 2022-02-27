export class Controller {
  forward: boolean;

  backward: boolean;

  left: boolean;

  right: boolean;

  zVector: { direction: number; magnitude: number; };

  xVector: { direction: number; magnitude: number; };

  time: number;

  controls: { isLocked: boolean; moveRight: any; moveForward: any; };

  constructor(controls: { isLocked: boolean, moveRight: any, moveForward: any, }) {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;
    this.zVector = { direction: 0, magnitude: 0 };
    this.xVector = { direction: 0, magnitude: 0 };
    this.time = performance.now();
    this.controls = controls;
  }

  onKeyDown = ( event: { key: string }) => {
    switch (event.key) {
      case 'w':
        this.forward = true;
        break;
      case 'a':
        this.left = true;
        break;
      case 's':
        this.backward = true;
        break;
      case 'd':
        this.right = true;
        break;
      default:
        break;
    }
  };

  onKeyUp = ( event: { key: string }) => {
    switch (event.key) {
      case 'w':
        this.forward = false;
        break;
      case 'a':
        this.left = false;
        break;
      case 's':
        this.backward = false;
        break;
      case 'd':
        this.right = false;
        break;
      default:
        break;
    }
  };

  move = ( newTime: number, speed: number ) => {
    if (this.controls.isLocked === true) {
      const timeDelta = (newTime - this.time) / 1000;
      this.zVector.direction = Number(this.forward) - Number(this.backward);
      this.xVector.direction = Number(this.right) - Number(this.left);
      this.xVector.magnitude = 0; this.zVector.magnitude = 0;
      if (this.forward || this.backward) {
        this.zVector.magnitude = this.zVector.direction * speed * timeDelta;
      }
      if (this.right || this.left) {
        this.xVector.magnitude = this.xVector.direction * speed * timeDelta;
      }
      this.controls.moveRight(this.xVector.magnitude * timeDelta);
      this.controls.moveForward(this.zVector.magnitude * timeDelta);
    }
    this.time = newTime;
  };
}