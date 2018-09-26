import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Constants, MODEL_TYPE } from '../../../constant/config/constants';

declare var _: any;
declare var $: any;

@Component({
  selector: 'photo-item-preview',
  templateUrl: 'photo-item-preview.component.html',
  styleUrls: ['photo-item-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PhotoItemPreviewComponent implements OnChanges {
  @Input() photo: any;
  @Input() files: any;
  @Input() hasUploadingPhoto = false;
  readonly MODEL = MODEL_TYPE;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  readonly tooltip: any = Constants.tooltip;

  ngOnChanges(changes: SimpleChanges) {
  }

  onAction(event: any) {
    this.events.emit(event);
  }

}
