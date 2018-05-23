import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Constants } from '../../../constant/config/constants';

declare var _: any;
declare var $: any;

@Component({
    selector: 'photo-item-preview',
  templateUrl: 'photo-item-preview.component.html',
  styleUrls: ['photo-item-preview.component.scss']
})

export class PhotoItemPreviewComponent implements OnChanges {
  @Input() photo: any;
  @Input() files: any;
  @Input() hasUploadingPhoto: boolean;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  tooltip: any = Constants.tooltip;

  ngOnChanges(changes: SimpleChanges) {
  }

  onAction(event: any) {
    this.events.emit(event);
  }

}