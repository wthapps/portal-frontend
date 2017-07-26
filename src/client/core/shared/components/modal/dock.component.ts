import { Component, Input, HostBinding } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'wth-modal-dock',
  templateUrl: 'dock.component.html',
  styleUrls: ['dock.component.css']
})

export class ModalDockComponent {
  @HostBinding('class') classes = 'modal-dock-wrap';
  @Input() cssClass: string = 'hidden';

  collapse: boolean = false;
  show: boolean = false;

  open() {
    this.cssClass = '';
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
