import { Component, OnInit } from '@angular/core';
import { Constants } from '../../../core/shared/config/constants';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-actions-bar',
  templateUrl: 'actions-bar.component.html',
  styleUrls: ['actions-bar.component.css']
})
export class ZNoteSharedActionBarComponent implements OnInit {

  tooltip: any = Constants.tooltip;
  constructor() {
  }

  ngOnInit() {
  }
}
