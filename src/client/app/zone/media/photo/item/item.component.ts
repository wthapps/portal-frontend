import { Component, OnChanges, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { ZMediaService } from '../../media.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-item',
  templateUrl: 'item.component.html',
  styles: [`
    :host {
      float: left;
      width: 20%;
      padding: 0 5px;
      margin-bottom: 10px;
    }
  `]
})
export class ZMediaPhotoItemComponent {
  @Input() data: any;
  @Input() photoDetail: any;
  @Input() mediaToolbar: any;

  @HostBinding('class') ItemClass: string = '';

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private mediaService: ZMediaService) {
  }

  onFavourite() {

  }

  onAction(ev: string) {
    this.outEvent.emit({
      action: ev,
      data: this.data
    })
  }

}
