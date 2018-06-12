import {
  Component,
  Output,
  Input,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Constants } from '@shared/constant';

@Component({
  selector: 'sharing-detail-info',
  templateUrl: 'sharing-detail-info.component.html',
  styleUrls: ['sharing-detail-info.component.scss']
})
export class SharingDetailInfoComponent implements OnChanges {
  @Input() object: any;
  @Output() closeInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() showFormEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() event: EventEmitter<any> = new EventEmitter<any>();

  profileUrl = `${Constants.baseUrls.social}/profile/`;
  recipients: Array<any> = [];

  updateProperties(properties: any) {
    if (properties.hasOwnProperty('object')) {
      this.object = properties.object;
    }

    if (properties.hasOwnProperty('recipients')) {
      this.recipients = properties.recipients;
    }
  }

  onClose() {
    this.closeInfo.emit();
  }

  ngOnChanges() {
    if (this.object) {
    }
  }

  onShowEditInfo() {
    this.showFormEdit.emit();
  }



  doAction(options?: any) {
    if (this.object.capabilities && !this.object.capabilities.canEdit && options.action === 'openModal') {
      return;
    }
    this.event.emit(options);
  }
}
