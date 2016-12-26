import { Component, Input, EventEmitter, Output, HostBinding } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'z-media-album-item',
  templateUrl: 'item.component.html'
})
export class ZMediaAlbumItemComponent {
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
