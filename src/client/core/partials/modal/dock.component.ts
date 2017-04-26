import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  host: {
    'class': 'modal-dock-wrap'
  },
  selector: 'wth-modal-dock',
  templateUrl: 'dock.component.html',
  styleUrls: ['dock.component.css']
})

export class ModalDockComponent {
  @Input() cssClass: string = 'hidden';

  collapse: boolean = false;
  show: boolean = false;

  constructor() {
  }

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
