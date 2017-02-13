import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

declare var Selectables: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-list',
  templateUrl: 'list.component.html'
})
export class ZMediaShareListComponent implements AfterViewInit {
  @Input() type: string = '';
  @Input() data: any = [];
  @Input() view: string = 'grid';
  @Input() hasAction: any = []; // favourite, select, preview, previewAll

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();


  selectables: any;
  selectablesEnable: boolean = false;

  ngAfterViewInit() {
    this.selectables = new Selectables({
      zone: '#list-photo',
      elements: 'z-media-share-item',
      selectedClass: 'active',
      onSelect: (element: any)=> {
        console.log(element);
      }
    });

    // //later
    this.selectables.disable();
    //
    // // enable again
    // dr.enable();

  }

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
    this.outEvent.emit(ev);
  }

  actionSortbar(ev: any) {
    this.data = ev;
  }
}
