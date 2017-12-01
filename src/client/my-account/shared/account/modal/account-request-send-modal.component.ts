import { Component, ViewChild } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

@Component({
  moduleId: module.id,
  selector: 'account-request-send-modal',
  templateUrl: 'account-request-send-modal.component.html'
})

export class AccountRequestSendModalComponent {
  @ViewChild('modal') modal: ModalComponent;
  data: any;

  constructor(private commonEventService: CommonEventService) {
  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'add'}) {
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  request() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:send_request_ownership',
      payload: {...this.data}
    })
  }
}
