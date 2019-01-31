import { Component, ViewChild, Input } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventHandler, CommonEventService } from '@shared/services';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'card-user',
  templateUrl: 'card-user.component.html',
  styleUrls: ['card-user.component.scss']
})
export class CardUserComponent extends CommonEventHandler {
  channel = 'CardUserComponent';
  @Input() user: any;

  constructor(public commonEventService: CommonEventService ) {
    super(commonEventService);
  }
  @ViewChild('modal') modal: BsModalComponent;
  open(payload: any) {
    this.user = payload;
    this.modal.open();
  }
  sendMessage(){}
}
