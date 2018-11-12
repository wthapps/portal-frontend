import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { Constants } from '@wth/shared/constant/config/constants';

declare var _: any;
declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'account-edit-modal',
  templateUrl: 'account-edit-modal.component.html',
  styleUrls: ['account-edit-modal.component.scss']
})

export class AccountEditModalComponent implements OnInit {
  @Input() item: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: BsModalComponent;

  form: FormGroup;
  // name: AbstractControl;
  // email: AbstractControl;
  // password: AbstractControl;
  tooltip: any = Constants.tooltip;
  mode: string; // 'add', 'edit', 'view'

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService) {

  }

  ngOnInit() {
    this.initialize();
  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'edit'}) {
    this.mode = options.mode || 'edit';
    this.item = options.data;
    this.initialize();
    if (options.data) {

      // this.form.controls['name'].setValue(this.item.name);
      // this.form.controls['name'].setValue(this.item.name);
      // this.form.controls['email'].setValue(this.item.email);
      // this.form.controls['password'].setValue(this.item.generated_password);
      // this.form.controls['password'].setValue(item.name);
    }
    this.modal.open(options).then();
  }

  edit() {
    this.mode = 'edit';
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  initialize() {
    if (this.form == undefined) {
      this.form = this.fb.group({
        'id': [this.item.id, Validators.compose([
          Validators.required
        ])],
        'first_name': [this.item.first_name, Validators.compose([
          Validators.required, CustomValidator.blanked
        ])],
        'last_name': [this.item.last_name, Validators.compose([
          Validators.required, CustomValidator.blanked
        ])],
        'email': [this.item.email, Validators.compose([
          Validators.required
        ])]
        // 'password': [this.item.generated_password, Validators.compose([
        //   Validators.required,
        //   Validators.minLength(8),
        //   CustomValidator.lowercaseUppercase,
        //   // CustomValidator.specialSymbolOrNumber
        // ])]
      });
    }
  }

  delete() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_delete_modal',
      payload: {mode: 'edit', accountAction: 'delete', data: [this.item], accounts: []}
    });
  }


  save() {
    // this.mode = 'view';
    let account = this.form.value;
    account.name = `${account.first_name} ${account.last_name}`;
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:update',
      payload: {data: account}
    });
    this.modal.close().then();
  }

  acceptRequestOwnership() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_accept_request_ownership_modal',
      payload: {data: this.form.value}
    });
  }

  togglePassword(event: any): void {
    const target = event.target || event.srcElement || event.currentTarget;
    const inputPass = $(target).prev();
    if (inputPass.attr('type') === 'password') {
      inputPass.attr('type', 'text');
      $(target).addClass('active');
    } else {
      inputPass.attr('type', 'password');
      $(target).removeClass('active');
    }
  }

}
