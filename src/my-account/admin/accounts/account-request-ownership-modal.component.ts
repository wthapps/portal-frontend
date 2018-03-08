import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';

declare var _: any;
declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'account-request-ownership-modal',
  templateUrl: 'account-request-ownership-modal.component.html'
})

export class AccountRequestOwnershipModalComponent implements OnInit {
  @Input() parent: any;
  @Input() user: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: BsModalComponent;
  options: any;

  constructor(private commonEventService: CommonEventService) {

  }

  ngOnInit() {
  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'edit'}) {
    this.parent = options.data;
    this.user = options.user;
    this.options = options;
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  send() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:send_request_ownership',
      payload: {...this.options, accountAction: 'delete'}
    });
    this.modal.close().then();
  }

}
