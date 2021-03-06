import {
  Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges,
  AfterViewInit
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';

declare var _: any;
declare var $: any;
declare let moment: any;


@Component({
  moduleId: module.id,
  selector: 'account-list-edit-modal',
  templateUrl: 'account-list-edit-modal.component.html',
  styleUrls: ['account-list-edit-modal.component.scss']
})

export class AccountListEditModalComponent implements OnInit, AfterViewInit {
  @Input() data: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: BsModalComponent;

  form: FormGroup;
  deleteObjects: any = [];
  type = 'items';
  noOfCtrl = 2;
  userId = 0;

  accounts: Array<any>;
  fullAccountCount = 0;
  subAccountCount = 0;
  accountCount: number = this.fullAccountCount + this.subAccountCount;

  // These are get value form subscription and plan
  fullPrice: any = 9.99;
  subPrice: any = 4.99;

  fullAmount: any = this.fullAccountCount * this.fullPrice;
  subAmount: any = this.subAccountCount * this.subPrice;
  accountAmount: any = this.fullAmount + this.subAmount;

  defaultDate: string = moment().subtract(13, 'years').calendar(); // at least 13 year-old
  maxDate: Date = new Date(moment().subtract(13, 'years').calendar());
  subscription: any;

  yearRange: string;

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService) {
    const d = this.maxDate;
    const yearRangeEnd = d.getFullYear();
    const yearRangestar = yearRangeEnd - 100;
    this.yearRange = `${yearRangestar}:${yearRangeEnd}`;
  }

  ngOnInit() {
    this.initialize(new Array<any>());
  }

  ngAfterViewInit() {

  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = { mode: 'add', data: undefined, subscription: {} }) {
    this.subAccountCount = 0;
    this.fullAccountCount = 0;
    this.accounts = options.accounts;
    this.subscription = options.subscription;
    this.data = options.data;
    this.initialize(this.data);
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.removeAll();
    this.modal.close(options).then();
  }

  initialize(items: Array<any>) {

    if (this.form === undefined) {
      this.form = this.fb.group({
        'items': this.fb.array([])
      });

      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          this.add(items[i].parent_id != null ? true : false, items[i]);
        }
      } else if (items.length === 0) {
        for (let i = 0; i < this.noOfCtrl; i++) {
          this.add(i % 2 !== 0 ? true : false);
        }
      }
    }
  }

  create(subAccount: boolean, item?: any) {
    const parentId = subAccount === false ? null : this.userId;
    const creatorId = parentId == null ? 0 : null;

    if (item) {
      this.countNoOfSubAndMaster(item);
      return this.fb.group({
        email: [item.email, Validators.compose([Validators.required, CustomValidator.emailFormat])],
        firstName: [item.firstName, Validators.compose([Validators.required, CustomValidator.blanked])],
        lastName: [item.lastName, Validators.compose([Validators.required, CustomValidator.blanked])],
        birthday: [item.birthday, Validators.compose([Validators.required])],
        id: [item.id],
        parent_id: [item.parent_id],
        creator_id: [item.creator_id]
      });
    } else {
      const group = this.fb.group({
        email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])],
        firstName: ['', Validators.compose([Validators.required, CustomValidator.blanked])],
        lastName: ['', Validators.compose([Validators.required, CustomValidator.blanked])],
        birthday: [this.defaultDate, Validators.compose([Validators.required])],
        id: [null],
        parent_id: [parentId],
        creator_id: [creatorId]
      });
      // group.controls['parent_id'].setValue(parentId);
      // group.controls['creator_id'].setValue(creatorId);
      // group.controls['birthday'].setValue(moment().subtract(13, 'years').calendar());
      return group;
    }
  }

  add(subAccount: boolean, item?: any) {
    const control = <FormArray>this.form.controls.items;
    if (item) {
      const group = this.create(subAccount, item);
      control.push(group);
      this.changed(group.controls);
    } else {
      control.push(this.create(subAccount));
    }
  }

  continue() {
    this.data = this.form.value.items;
    _.remove(this.data, (item: any) => {
      return item.email === '' || item.firstName === '' || item.lastName === '';
    });
    // status to current object
    _.forEach(this.data, (item: any, index: number) => {
      this.data[index] = { ...item, status: 'new' };
    });
    this.modal.close(null).then();
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:open_subscription_update_modal',
      payload: {
        mode: 'edit',
        data: this.data,
        accountAction: 'add',
        accounts: this.accounts,
        editing: {
          accountCount: this.subAccountCount,
          accountPrice: this.subPrice
        },
        subscription: this.subscription
      }
    });
  }

  hide(event: any) {
    console.log('hide:::', event);
  }

  done(values: any) {
    this.data = _.concat(this.deleteObjects, values);
    this.event.emit(this.data);
  }

  remove(i: number, item: any) {
    const control = <FormArray>this.form.controls[this.type];

    this.changed(item, true);

    control.removeAt(i);
    if (item && item.id && item.id.value) {
      _.forEach(this.data, (data: any) => {
        if (data.id === item.id.value) {
          data._destroy = true;
          this.deleteObjects.push(data);
        }
      });
    }
  }

  removeAll() {
    const control = <FormArray>this.form.controls[this.type];
    control.controls.length = 0;
    this.deleteObjects.length = 0;
    control.reset();
  }

  getFormControls() {
    return (<FormArray>this.form.get(this.type)).controls;
  }

  validItems(): boolean {
    let result = false;
    const items = this.form.value.items;

    if (items.length === 0) return false;
    if (items.length === 1) {
      return this.form.valid;
    }
    _.forEach((<FormArray>this.form.get(this.type)).controls, (item: any) => {
      if (item.controls.firstName.valid && item.controls.lastName.valid && item.controls.email.valid && item.controls.birthday.valid) {
        result = true;
        // this.countNoOfSubAndMaster(item.value);
      }
    });
    return result;
  }

  changed(item: any, countDown: boolean = false) {
    if (item.firstName.valid && item.lastName.valid && item.email.valid && item.birthday.valid) {
      this.countNoOfSubAndMaster(item.parent_id.value, countDown);
    }
  }

  private countNoOfSubAndMaster(parent_id: any, countDown: boolean = false) {

    if (parent_id == null) {
      if (countDown)
        this.fullAccountCount--;
      else
        this.fullAccountCount++;
    }
    if (parent_id === 0) {
      if (countDown)
        this.subAccountCount--;
      else
        this.subAccountCount++;
    }

    if (this.subAccountCount < 0)
      this.subAccountCount = 0;

    if (this.fullAccountCount < 0)
      this.fullAccountCount = 0;


    this.subAmount = this.subAccountCount * this.subPrice;
    this.fullAmount = this.fullAccountCount * this.fullPrice;
    this.accountAmount = this.subAmount + this.fullAmount;
    this.accountCount = this.subAccountCount + this.fullAccountCount;
  }

}
