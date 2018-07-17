import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Constants } from '@shared/constant';

@Component({
  selector: 'media-detail-info',
  templateUrl: 'media-detail-info.component.html',
  styleUrls: ['media-detail-info.component.scss']
})
export class MediaDetailInfoComponent implements OnChanges {
  @Input() object: any;
  @Input() users: any;
  @Output() closeInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() tagEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() showFormEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  profileUrl = `${Constants.baseUrls.social}/profile/`;
  share: any = null;

  onClose() {
    this.closeInfo.emit();
  }

  ngOnChanges() {
  }

  onShowEditInfo() {
    this.showFormEdit.emit();
  }

  tag(album: any) {
    this.tagEvent.emit(album);
  }

  doAction(options?: any) {
    this.event.emit(options);
  }
}
