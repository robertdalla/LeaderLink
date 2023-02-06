export class ViewPort {
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  get isXs(): boolean {
    return this.width <= 576;
  }

  get isSm(): boolean {
    return this.width > 576;
  }

  get isMd(): boolean {
    return this.width > 768;
  }

  get isLg(): boolean {
    return this.width > 992;
  }

  get isXl(): boolean {
    return this.width > 1200;
  }
}
