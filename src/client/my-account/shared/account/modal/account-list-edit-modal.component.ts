import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../../core/shared/validator/custom.validator';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'account-list-edit-modal',
  templateUrl: 'account-list-edit-modal.component.html',
  styleUrls: ['account-list-edit-modal.component.css']
})

export class AccountListEditModalComponent implements OnInit {
  @Input() data: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;
  deleteObjects: any = [];
  type: string = 'items';
  noOfCtrl: number = 4;
  userId: number = 0;

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService) {
  }

  ngOnInit() {
    this.initialize(new Array<any>());
  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {mode:'add', data: undefined}) {
    if(options.mode == 'add') {
      this.data = new Array<any>();
    } else if(options.mode == 'edit') {
      this.data = options.data;
    }
    this.initialize(this.data);
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.removeAll();
    this.modal.close(options).then();
  }

  initialize(items: Array<any>) {

    if(this.form == undefined) {
      this.form = this.fb.group({
        'items': this.fb.array([])
      });

      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          this.add(items[i].parent_id != null? true: false, items[i]);
        }
      } else if(items.length == 0) {
        for (let i = 0; i < this.noOfCtrl; i++) {
          this.add(i % 2 != 0? true : false);
        }
      }
    }
  }

  create(subAccount: boolean, item?: any) {
    let parentId = subAccount == false? null: this.userId;
    if (item) {
      return this.fb.group({
        email: [item.email, Validators.compose([Validators.required, CustomValidator.emailFormat])],
        name: [item.name, Validators.compose([Validators.required])],
        birthday: ['', Validators.compose([Validators.required])],
        id: [item.id],
        parent_id: [item.parent_id],
        created_by_id: [item.created_by_id]
      });
    } else {

      let group = this.fb.group({
        email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])],
        name: ['', Validators.compose([Validators.required])],
        birthday: ['', Validators.compose([Validators.required])],
        id: [null],
        parent_id: [parentId],
        created_by_id: [parentId]
      });
      group.controls['parent_id'].setValue(parentId);
      return group;
    }
  }

  add(subAccount: boolean, item?: any) {
    let control = <FormArray>this.form.controls.items;
    if (item) {
      control.push(this.create(subAccount, item));
    } else {
      control.push(this.create(subAccount));
    }
  }

  continue() {
    let data = this.form.value.items;
    _.remove(data, (item: any) => {
      return item.email == '' || item.name == '';
    });
    this.modal.close(null).then();
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:open_subscription_update_modal',
      payload: {data: data}
    });
  }

  done(values: any) {
    this.data = _.concat(this.deleteObjects, values);
    this.event.emit(this.data);
  }

  remove(i: number, item: any) {
    let control = <FormArray>this.form.controls[this.type];
    control.removeAt(i);
    if (item && item.id && item.id.value) {
      _.forEach(this.data, (data: any) => {
        if (data.id == item.id.value) {
          data._destroy = true;
          this.deleteObjects.push(data);
        }
      });
    }
  }

  removeAll() {
    let control = <FormArray>this.form.controls[this.type];
    control.controls.length = 0;
    this.deleteObjects.length = 0;
    control.reset();
  }

  getFormControls() {
    return (<FormArray>this.form.get(this.type)).controls;
  }

  validItems(): boolean {
    let result = false;
    let items = this.form.value.items;

    if(items.length == 0) return false;
    if(items.length == 1) {
      return this.form.valid;
    }
    _.forEach(this.form.value.items, (item: any) => {
      if(item.email != '' && item.name != '') {
        result = true;
      }
    });
    return result;
  }
}
