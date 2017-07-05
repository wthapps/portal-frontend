import { Component, OnInit, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.css']
})
export class ZContactSharedList implements OnInit {
  @Input() data: any;
  selectedAll: boolean = false;
  selectedAllClass: boolean = false;
  selectedObjects: any = [];

  constructor() {
  }

  ngOnInit() {
  }

  onSelectedAll(e?: any) {
    if (e) {
      this.selectedAllClass = false;
    } else {
      this.selectedAll = !this.selectedAll;
      this.selectedAllClass = true;
    }
  }
}
