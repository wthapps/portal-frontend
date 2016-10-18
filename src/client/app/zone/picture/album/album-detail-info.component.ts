import {
  Component, AfterViewInit, OnDestroy, Output, Input, EventEmitter, OnChanges, SimpleChange,
  OnInit, SimpleChanges
} from '@angular/core';
import {Album} from "../../../shared/models/album.model";
import {FormTextElement} from "../../../shared/models/form/form-text-element.model";
import {FormBase} from "../../../shared/models/form/form-base.model";


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
  showCreateAlbumForm:boolean = true;
  formData: FormBase;
  albumData:Album = null;

  onClose() {
    this.closeInfo.emit();
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if(this.album.id != null) {
      let fields = [
        new FormTextElement({id:"album-name",name: "Name", value: this.album.name}),
        new FormTextElement({id:"album-description",name: "Description", value: this.album.description}),
      ];
      this.formData = new FormBase({title: "Test", fields: fields});
    }
  }

  onEdit() {

  }
}
