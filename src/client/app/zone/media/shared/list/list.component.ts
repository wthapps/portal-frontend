import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-media-share-list',
  templateUrl: 'list.component.html'
})
export class ZMediaShareListComponent {
  @Input() data: any = [];
  @Input() view: string = 'grid';
  @Input() hasAction: any = []; // favourite, select, preview, previewAll

  actionItem(ev: any) {
    console.log('actionItem:', ev);
  }

  actionSortbar(ev: any) {
    console.log('actionSortbar:', ev);
  }
}
