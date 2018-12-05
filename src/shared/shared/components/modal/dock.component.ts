import { Component, Input, HostBinding } from '@angular/core';

@Component({
    selector: 'wth-modal-dock',
  templateUrl: 'dock.component.html',
  styleUrls: ['dock.component.scss']
})

export class ModalDockComponent {
  @HostBinding('class') classes = 'modal-dock-wrap';
  @Input() cssClass = 'hidden';

  collapse = false;
  show = false;

  open(cssClass = '') {
    this.cssClass = cssClass;
  }

  close() {
    this.cssClass = 'hidden';
  }

  toggleCollapse() {
    if (this.collapse) {
      this.cssClass = '';
    } else {
      this.cssClass = 'modal-dock-collapse';
    }
    this.collapse = !this.collapse;
  }
}
