import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Album } from '../shared/model/album.model';
import { Constants } from '@shared/constant';

@Component({
  moduleId: module.id,
  selector: 'album-detail-info',
  templateUrl: 'album-detail-info.component.html',
  styleUrls: ['album-detail-info.component.scss']
})
export class AlbumDetailInfoComponent implements OnChanges {
  @Input() object: any;
  @Output() closeInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() tagEvent: EventEmitter<Album> = new EventEmitter<Album>();
  @Output() showFormEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  albumData: Album = null;

  profileUrl = `${Constants.baseUrls.social}/profile/`;

  updateProperties(properties: any) {
    if (properties.hasOwnProperty('object')) {
      this.object = properties.object;
    }
  }

  onClose() {
    this.closeInfo.emit();
  }

  ngOnChanges() {
    // if(this.album.id != null) {
    //   this.renderForm();
    // }
  }

  onShowEditInfo() {
    this.showFormEdit.emit();
  }

  tag(album: Album) {
    this.tagEvent.emit(album);
  }

  doAction(options?: any) {
    this.event.emit(options);
  }
}
