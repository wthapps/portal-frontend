import { Component, ViewChild} from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

@Component({
  moduleId: module.id,
  selector: 'account-request-accept-modal',
  templateUrl: 'account-request-accept-modal.component.html'
})

export class AccountRequestAcceptModalComponent {
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

  reject() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:reject_request_ownership',
      payload: {...this.data}
    })
  }

  accept() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:accept_request_ownership',
      payload: {...this.data}
    })
  }
}
