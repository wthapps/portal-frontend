import {
  Component, AfterViewInit, OnDestroy, Output, Input, EventEmitter, OnChanges, SimpleChange,
  OnInit, SimpleChanges
} from '@angular/core';
import {Album} from "../../../shared/models/album.model";


declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-album-detail-info',
  templateUrl: 'album-detail-info.component.html',
  styleUrls: ['album.component.css'],
})

export class ZAlbumDetailInfoComponent {

  @Input() album:Album;
  @Output() closeInfo: EventEmitter = new EventEmitter();

  onClose() {
    this.closeInfo.emit();
  }
}
