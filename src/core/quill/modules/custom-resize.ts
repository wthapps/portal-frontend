
import { BaseModule } from '@wth/core/quill/modules/base-module';

export class CustomResize extends BaseModule {
  boxes: any = [];
  options: any;
  img: any;
  overlay: any;
  overlayWrapper: any;

  requestUpdate: any;
  resizer: any;

  onMouseUp: any;
  onMouseMove: any;

  dragBox: any;
  // note starting mousedown position
  dragStartX: any;
  // store the width before the drag
  preDragWidth: any;

  constructor(quill, options: any) {
    super(quill, options);
  }

  onDestroy() {
    // reset drag handle cursors
    this.setCursor('');
  }

  onUpdate() {
  }

  onCreate(resizer: any) {
    this.options = resizer.options;
    this.overlay = resizer.overlay;
    this.img = resizer.img;
    this.resizer = resizer;
    this.requestUpdate = resizer.onUpdate();

    // track resize handles
    this.boxes = [];


    // add 4 resize handles
    this.addBox('nwse-resize'); // top left
    this.addBox('nesw-resize'); // top right
    this.addBox('nwse-resize'); // bottom right
    this.addBox('nesw-resize'); // bottom left

    this.positionBoxes();
  }

  positionBoxes() {
    // const handleXOffset = `${-parseFloat(this.options.handleStyles.width) / 2}px`;
    // const handleYOffset = `${-parseFloat(this.options.handleStyles.height) / 2}px`;
    const handleXOffset = `${parseInt(this.overlay.style.left, 10) - 6}px`;
    const handleYOffset = `${parseInt(this.overlay.style.top, 10) - 6}px`;
    const handleHeight = `${parseInt(this.overlay.style.top, 10) - 6 + this.overlay.offsetHeight}px`;
    const handleWidth = `${parseInt(this.overlay.style.left, 10) - 6 + this.overlay.offsetWidth}px`;

    // set the top and left for each drag handle
    [
      { left: handleXOffset, top: handleYOffset },        // top left
      { left: handleWidth, top: handleYOffset },       // top right
      { left: handleWidth, top: handleHeight },    // bottom right
      { left: handleXOffset, top: handleHeight },     // bottom left
    ].forEach((pos, idx) => {
      Object.assign(this.boxes[idx].style, pos);
    });
  }

  addBox(cursor) {
    // create div element for resize handle
    const box = document.createElement('div');

    // Star with the specified styles
    Object.assign(box.style, this.options.handleStyles);
    box.style.cursor = cursor;

    // Set the width/height to use 'px'
    box.style.width = `${this.options.handleStyles.width}px`;
    box.style.height = `${this.options.handleStyles.height}px`;

    // listen for mousedown on each box
    box.addEventListener('mousedown', this.handleMousedown.bind(this), false);

    // add drag handle to document
    this.overlay.appendChild(box);
    // keep track of drag handle
    this.boxes.push(box);
  }

  handleMousedown(evt) {
    // note which box
    this.dragBox = evt.target;
    // note starting mousedown position
    this.dragStartX = evt.clientX;
    // store the width before the drag
    this.preDragWidth = this.img.width || this.img.naturalWidth;
    // set the proper cursor everywhere
    this.setCursor(this.dragBox.style.cursor);
    // listen for movement and mouseup
    this.onMouseMove = this.handleDrag.bind(this);
    this.onMouseUp = this.handleMouseup.bind(this);

    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
  }

  handleMouseup(evt) {
    // reset cursor everywhere
    this.setCursor('');
    // stop listening for movement and mouseup
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  handleDrag(evt) {
    if (!this.img) {
      // image not set yet
      return;
    }
    // update image size
    const deltaX = evt.clientX - this.dragStartX;
    if (this.dragBox === this.boxes[0] || this.dragBox === this.boxes[3]) {
      // left-side resize handler; dragging right shrinks image
      this.img.width = Math.round(this.preDragWidth - deltaX);
    } else {
      // right-side resize handler; dragging right enlarges image
      this.img.width = Math.round(this.preDragWidth + deltaX);
    }
    this.positionBoxes();
    this.resizer.onUpdate();
  }

  setCursor(value) {
    [
      document.body,
      this.img,
    ].forEach((el) => {
      el.style.cursor = value;   // eslint-disable-line no-param-reassign
    });
  }
}
