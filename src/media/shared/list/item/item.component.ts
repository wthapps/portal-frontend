// import { Component, Input, EventEmitter, Output, HostBinding, OnChanges } from '@angular/core';
//
// declare var _: any;
//
// @Component({
//   moduleId: module.id,
//   selector: 'z-media-share-item',
//   templateUrl: 'item.component.html'
// })
// export class ZMediaShareItemComponent implements OnChanges {
//   @HostBinding('class') leftBarClass = 'row-img-item';
//   @Input() type: string = 'photo';
//   @Input() data: any;
//   @Input() hasAction: any = []; // favourite, select, preview, previewAll
//
//   @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
//
//   actionFavourite: boolean = false;
//
//   ngOnChanges() {
//     if (this.hasAction.indexOf('favourite') != -1) {
//       this.actionFavourite = true;
//     }
//   }
//
//   onAction(ev: string) {
//     if (this.hasAction.indexOf(ev) != -1) {
//       this.outEvent.emit({
//         action: ev,
//         data: this.data,
//         type: this.type
//       });
//     }
//   }
//
// }
