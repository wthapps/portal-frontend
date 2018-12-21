import { Component, Input, HostBinding, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'wth-modal-dock',
  templateUrl: 'dock.component.html',
  styleUrls: ['dock.component.scss']
})

export class ModalDockComponent {
  @HostBinding('class') classes = 'modal-dock-wrap';
  @Input() cssClass = 'hidden';
  @Output() closeEvent: EventEmitter<any> = new EventEmitter<any>();

  collapse = false;
  show = false;

  open(cssClass = '') {
    this.cssClass = cssClass;
  }

  close() {
    this.cssClass = 'hidden';
    this.closeEvent.emit('');
  }

  toggleCollapse() {
    if (this.collapse) {
      this.cssClass = this.cssClass.replace('modal-dock-collapse', '');
    } else {
      this.cssClass = `${this.cssClass} modal-dock-collapse`;
    }
    this.collapse = !this.collapse;
  }
}
