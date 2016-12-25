import { Component, Input, EventEmitter, Output, HostBinding } from '@angular/core';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-item',
  templateUrl: 'item.component.html'
})
export class ZMediaPhotoItemComponent {
  @HostBinding('class') leftBarClass = 'row-img-item';
  @Input() data: any;

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  onAction(ev: string) {
    this.outEvent.emit({
      action: ev,
      data: this.data
    });
  }

}
