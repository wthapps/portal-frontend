import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '@wth/shared/constant/config/constants';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';

import { BsModalComponent } from 'ng2-bs3-modal';

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
  first_name: AbstractControl;
  last_name: AbstractControl;

  tooltip: any = Constants.tooltip;
  mode: string; // 'add', 'edit', 'view'

  constructor(private fb: FormBuilder,
              private commonEventService: CommonEventService) {
    this.form = fb.group({
      'first_name': ['',
        Validators.compose([Validators.required, CustomValidator.blanked])
      ],
      'last_name': ['',
        Validators.compose([Validators.required, CustomValidator.blanked])
      ]
    });

    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
  }

  ngOnInit() {
  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = { data: undefined, mode: 'edit' }) {
    this.mode = options.mode || 'edit';
    this.item = options.data;
    if (options.data) {
      (<FormControl>this.first_name).setValue(this.item.first_name);
      (<FormControl>this.last_name).setValue(this.item.last_name);
    }
    this.modal.open(options).then();
  }

  edit() {
    this.mode = 'edit';
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  delete() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_delete_modal',
      payload: { mode: 'edit', accountAction: 'delete', data: [this.item], accounts: [] }
    });
  }


  save(value: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:update',
      payload: { data: {...this.item, name: `${value.first_name} ${value.last_name}`} }
    });
    this.modal.close().then();
  }
}
