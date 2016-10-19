import {
  Component, AfterViewInit, OnDestroy, Output, Input, EventEmitter, OnChanges, SimpleChange,
  OnInit, SimpleChanges
} from '@angular/core';
import {Album} from "../../../shared/models/album.model";
import {FormTextElement} from "../../../shared/models/form/form-text-element.model";
import {FormBase} from "../../../shared/models/form/form-base.model";
import {AlbumService} from "../../../shared/services/picture/album.service";


declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-album-detail-info',
  templateUrl: 'album-detail-info.component.html',
  styleUrls: ['album.component.css'],
})

export class ZAlbumDetailInfoComponent implements OnInit, OnChanges{

  @Input() album:Album;
  @Output() closeInfo: EventEmitter = new EventEmitter();
  @Output() showFormEdit: EventEmitter = new EventEmitter();
  formData: FormBase;
  albumData:Album = null;

  constructor(
    private albumService?: AlbumService,
  ) {

  }

  onClose() {
    this.closeInfo.emit();
  }

  ngOnInit() {

  }

  ngOnChanges() {
    // if(this.album.id != null) {
    //   this.renderForm();
    // }
  }

  onShowEditInfo() {
    this.showFormEdit.emit();
  }
}
