import { Component, Input, EventEmitter, Output } from '@angular/core';

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

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  onAction(ev: string) {
    this.outEvent.emit({
      action: ev,
      data: this.data
    })
  }

}
