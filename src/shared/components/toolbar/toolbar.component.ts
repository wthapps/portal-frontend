import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Constants } from '@wth/shared/constant';

declare let _: any;

@Component({
  selector: 'w-toolbar',
  exportAs: 'wToolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.scss']
})

export class WToolbarComponent implements OnInit {
  @Input() selectedObjects: Array<any> = new Array<any>();
  @Input() view;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  grid: string = 'grid';
  list: string = 'list';
  timeline: string = 'timeline';

  tooltip: any = Constants.tooltip;

  constructor() {
  }

  ngOnInit() {

  }

  doAction(event: any) {
    this.event.emit(event);
  }
}
