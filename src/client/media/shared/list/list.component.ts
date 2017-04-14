import { Component, Input, Output, EventEmitter } from '@angular/core';

declare var Selectables: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-list',
  templateUrl: 'list.component.html'
})
export class ZMediaShareListComponent {
  @Input() type: string = '';
  @Input() data: any = [];
  @Input() view: string = 'grid';
  @Input() showSortBar: boolean = true;
  @Input() hasAction: any = []; // favourite, select, preview, previewAll

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();


  groupBy: string;

  selectablesEnable: boolean = false;

  onDragenter(e: any) {
    e.preventDefault();
    // if (!this.selectablesEnable) {
    //   this.selectables.enable();
    // }
  }

  onDragleave(e: any) {
    e.preventDefault();
    // this.selectablesEnable = false;
  }

  actionItem(ev: any) {
    if (ev.action == 'group') {
      this.groupBy = ev.data;
      return;
    }
    this.outEvent.emit(ev);
  }

  actionSortbar(ev: any) {
    this.data = ev;
  }
}
