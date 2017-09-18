import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ZNoteSharedToolBarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';

  constructor() {
  }

  ngOnInit() {
  }
}
