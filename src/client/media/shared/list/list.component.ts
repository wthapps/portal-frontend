import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-media-share-list',
  templateUrl: 'list.component.html'
})
export class ZMediaShareListComponent {
  @Input() type: string = '';
  @Input() data: any = [];
  @Input() view: string = 'grid';
  @Input() hasAction: any = []; // favourite, select, preview, previewAll

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  actionItem(ev: any) {
    this.outEvent.emit(ev);
  }

  actionSortbar(ev: any) {
    this.data = ev;
  }
}
