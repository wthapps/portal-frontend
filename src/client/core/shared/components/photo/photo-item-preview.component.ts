import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'photo-item-preview',
  templateUrl: 'photo-item-preview.component.html',
  styleUrls: ['photo-item-preview.component.css']
})

export class PhotoItemPreviewComponent implements OnChanges {
  @Input() photo: any;
  @Input() files: any;
  @Input() hasUploadingPhoto: boolean;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges) {
  }

  onAction(event: any) {
    this.events.emit(event);
  }

}
