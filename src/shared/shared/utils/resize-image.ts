declare let $: any;

export class ResizeImage {
  area: any;
  ready: boolean = false;
  id: any;
  resizeFrame: any;
  resizeBorder: any;
  resizeHandlers: Array<Element> = [];
  constant: any = {
    color: '#F54A59',
    minBorderBox: 20
  };
  handlers: any = [
    {id: 'border-handle', style: {position: 'absolute', border: `1px solid ${this.constant.color}`,'-webkit-box-sizing': 'border-box','-moz-box-sizing': 'border-box','box-sizing': 'border-box','z-index': '30','background-color': 'rgba(0,0,0,0)'}},
    {id: 'nw-handle', class: 'handler', style: {cursor: 'nw-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}},
    {id: 'ne-handle', class: 'handler', style: {cursor: 'ne-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}},
    {id: 'se-handle', class: 'handler', style: {cursor: 'se-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}},
    {id: 'sw-handle', class: 'handler', style: {cursor: 'sw-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}},
    {id: 'n-handle', class: 'handler', style: {cursor: 'n-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}},
    {id: 'e-handle', class: 'handler', style: {cursor: 'e-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}},
    {id: 's-handle', class: 'handler', style: {cursor: 's-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}},
    {id: 'w-handle', class: 'handler', style: {cursor: 'w-resize', position: 'absolute', border: '1px solid #fff','background-color': this.constant.color, width: '10px', height: '10px', 'font-size': '0', 'z-index': '551'}}
  ];
  img: any;
  change: any;
  changing: boolean = false;
  currentX: any;
  currentY: any;
  x: any;
  y: any;
  timeInterval: any;

  checkImageExist: boolean = false;
  checkImageExistInterval: any;

  constructor(id: any) {
    this.id = id;
    document.addEventListener('DOMContentLoaded', this.onReady.bind(this));
    window.addEventListener('load', this.onReady.bind(this));
    setTimeout(() => {this.onReady(), 2000});
  }

  onReady() {
    window.removeEventListener( 'load', this.onReady );
    document.removeEventListener( 'DOMContentLoaded', this.onReady );

    if(!this.ready) {
      this.ready = true;
      this.onInit();
    }
  }

  onInit() {
    this.area = document.getElementById(this.id);
    this.resizeFrame = document.createElement('div');
    this.resizeFrame.setAttribute('id', 'ri-frame');
    this.area.appendChild(this.resizeFrame);
    // this.setStyle(this.area, {'user-select': 'none'})
    this.resizeFrame.style.display = 'none';
    // Add handlers
    for(let handle of this.handlers) {
      let h: Element = document.createElement('div');
      h.setAttribute('id', handle.id);
      this.setStyle(h, handle.style);
      h.addEventListener('mousedown', (e: any) => {this.trigger(e.currentTarget)});
      this.resizeFrame.appendChild(h);
      this.resizeHandlers.push(h);
    }
    this.resizeBorder = this.resizeHandlers[0];
    this.setStyle(this.resizeBorder,  {'pointer-events': 'none'});
    this.resizeHandlers.shift();
    this.cacheMouseMove();
  }

  cacheMouseMove() {
    document.documentElement.addEventListener('mouseup', (e: any) => {
        clearInterval(this.timeInterval);
        if(this.change) this.changeSize();
        if (this.img) {
          let bound = this.img.getBoundingClientRect();
          let deltaX = e.offsetX - bound.x;
          let deltaY = e.offsetY - (bound.y + this.area.scrollTop);
          if (!$(this.resizeBorder).is(e.target) && $(this.resizeBorder).has(e.target).length == 0 && !this.changing)
          {
              this.close();
          } else {
            this.changing = false
          }
        }
    });
    document.addEventListener('mousemove', (e: any) => {
      this.x = e.pageX;
      this.y = e.pageY;
    }, false);
  }

  close() {
    this.resizeFrame.style.display = 'none';
    if(this.checkImageExistInterval) clearInterval(this.checkImageExistInterval);
  }

  trigger(el: any) {
    this.timeInterval = setInterval(() => {this.resize(el)}, 3);
    this.currentX = this.x;
    this.currentY = this.y;
    this.changing = true;
  }

  resize(el: any) {
    let deltaX = this.x - this.currentX;
    let deltaY = this.y - this.currentY;
    let rate = deltaX*this.img.offsetHeight/this.img.offsetWidth;
    // let bound = this.img.getBoundingClientRect();
    if( Math.abs(deltaX) + Math.abs(deltaY) > 10) {
      if(el.id == 'nw-handle') {
        if (this.img.offsetWidth - deltaX > this.constant.minBorderBox && this.img.offsetHeight - rate > this.constant.minBorderBox)
          this.setStyle(this.resizeBorder, {left: deltaX + this.img.offsetLeft + 'px', top: this.area.scrollTop + this.img.offsetTop + rate + 'px', width: this.img.offsetWidth - deltaX + 'px', height: this.img.offsetHeight - rate + 'px'});
      }
      if(el.id == 'n-handle') {
        if (this.img.offsetHeight - deltaY > this.constant.minBorderBox)
          this.setStyle(this.resizeBorder, {top: deltaY + this.img.offsetTop + this.area.scrollTop + 'px', height: this.img.offsetHeight - deltaY + 'px'});
      }
      if(el.id == 'ne-handle') {
        if (this.img.offsetWidth + deltaX > this.constant.minBorderBox && this.img.offsetHeight + rate > this.constant.minBorderBox)
          this.setStyle(this.resizeBorder, {right: this.x + 'px', top: this.img.offsetTop + this.area.scrollTop - rate + 'px', width: this.img.offsetWidth + deltaX + 'px', height: this.img.offsetHeight + rate + 'px'});
      }
      if(el.id == 'e-handle') {
        if (this.img.offsetWidth + deltaX > this.constant.minBorderBox)
        this.setStyle(this.resizeBorder, {right: this.x + 'px', width: this.img.offsetWidth + deltaX + 'px'});
      }
      if(el.id == 'se-handle') {
        if (this.img.offsetWidth + deltaX > this.constant.minBorderBox && this.img.offsetHeight + rate > this.constant.minBorderBox)
        this.setStyle(this.resizeBorder, {width: this.img.offsetWidth + deltaX + 'px', height: this.img.offsetHeight + rate + 'px'});
      }
      if(el.id == 's-handle') {
        if (this.img.offsetHeight + deltaY > this.constant.minBorderBox)
        this.setStyle(this.resizeBorder, {height: this.img.offsetHeight + deltaY + 'px'});
      }
      if(el.id == 'sw-handle') {
        if (this.img.offsetWidth - deltaX > this.constant.minBorderBox && this.img.offsetHeight - rate > this.constant.minBorderBox)
        this.setStyle(this.resizeBorder, {left: deltaX + this.img.offsetLeft + 'px', width: this.img.offsetWidth - deltaX + 'px', height: this.img.offsetHeight - rate + 'px'});
      }
      if(el.id == 'w-handle') {
        if (this.img.offsetWidth - deltaX > this.constant.minBorderBox)
        this.setStyle(this.resizeBorder, {left: deltaX + this.img.offsetLeft + 'px', width: this.img.offsetWidth - deltaX + 'px'});
      }
      this.tick();
      this.change = true;
    }

  }

  changeSize() {
    this.setStyle(this.img, {width: this.resizeBorder.offsetWidth + 'px', height: this.resizeBorder.offsetHeight + 'px'});
    this.change = false;
    this.relocation();
  }

  setStyle(el: any, properties: any) {
     for (let property in properties)
        el.style[property] = properties[property];
  }

  edit(img: any, options: any) {
    setTimeout(() => {
      this.img = img;
      this.resizeFrame.style.display = 'block';
      this.relocation();
      // turn on checkImageExist
      this.checkImageExist = true;
      let check = () => { if($('img[data-id=' + this.img.dataset.id + ']').length == 0) this.close() };
      this.checkImageExistInterval = setInterval(() => { check(); }, 20);
    }, 100);

  }

  relocation() {
    // let bound = this.img.getBoundingClientRect();
    this.setStyle(this.resizeBorder, {left: this.img.offsetLeft + 'px', top: this.img.offsetTop + this.area.scrollTop + 'px', height: this.img.offsetHeight + 'px', width: this.img.offsetWidth + 'px'});
    this.tick();
  }

  tick() {
    this.setStyle(this.resizeHandlers[0], {left: this.resizeBorder.offsetLeft - 5 + 'px', top: this.resizeBorder.offsetTop -5 + 'px'});
    this.setStyle(this.resizeHandlers[1], {left: this.resizeBorder.offsetLeft + this.resizeBorder.offsetWidth - 5 + 'px', top: this.resizeBorder.offsetTop -5 + 'px'});
    this.setStyle(this.resizeHandlers[2], {left: this.resizeBorder.offsetLeft + this.resizeBorder.offsetWidth - 5 + 'px', top: this.resizeBorder.offsetTop + this.resizeBorder.offsetHeight -5 + 'px'});
    this.setStyle(this.resizeHandlers[3], {left: this.resizeBorder.offsetLeft - 5 + 'px', top: this.resizeBorder.offsetTop + this.resizeBorder.offsetHeight -5 + 'px'})
    this.setStyle(this.resizeHandlers[4], {left: this.resizeBorder.offsetLeft + this.resizeBorder.offsetWidth/2 - 5 + 'px', top: this.resizeBorder.offsetTop -5 + 'px'})
    this.setStyle(this.resizeHandlers[5], {left: this.resizeBorder.offsetLeft + this.resizeBorder.offsetWidth - 5 + 'px', top: this.resizeBorder.offsetTop + this.resizeBorder.offsetHeight/2 - 5 + 'px'})
    this.setStyle(this.resizeHandlers[6], {left: this.resizeBorder.offsetLeft + this.resizeBorder.offsetWidth/2 - 5 + 'px', top: this.resizeBorder.offsetTop + this.resizeBorder.offsetHeight - 5 + 'px'})
    this.setStyle(this.resizeHandlers[7], {left: this.resizeBorder.offsetLeft - 5 + 'px', top: this.resizeBorder.offsetTop + this.resizeBorder.offsetHeight/2 - 5 + 'px'})
  }
}
