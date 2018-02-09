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
declare let moment:any;


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
  type: string = 'items';
  noOfCtrl: number = 2;
  userId: number = 0;

  accounts: Array<any>;
  noOfMaster: number = 0;
  noOfSub: number = 0;
  // These are get value form subscription and plan
  masterPrice: any = 9.99;
  subPrice: any = 4.99;
  defaultDate: string = moment().subtract(13, 'years').calendar(); // at least 13 year-old
  maxDate: Date = new Date(moment().subtract(13, 'years').calendar());

  constructor(private fb: FormBuilder, private commonEventService: CommonEventService) {
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
  open(options: any = {mode:'add', data: undefined}) {
    this.noOfSub = 0;
    this.noOfMaster = 0;
    this.accounts = options.accounts;
    this.data = options.data;
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
    let creatorId = parentId == null ? 0 : null;

    if (item) {
      this.countNoOfSubAndMaster(item);
      return this.fb.group({
        email: [item.email, Validators.compose([Validators.required, CustomValidator.emailFormat])],
        name: [item.name, Validators.compose([Validators.required])],
        birthday: [item.birthday, Validators.compose([Validators.required])],
        id: [item.id],
        parent_id: [item.parent_id],
        creator_id: [item.creator_id]
      });
    } else {
      let group = this.fb.group({
        email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])],
        name: ['', Validators.compose([Validators.required])],
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
    let control = <FormArray>this.form.controls.items;
    if (item) {
      let group = this.create(subAccount, item);
      control.push(group);
      this.changed(group.controls);
    } else {
      control.push(this.create(subAccount));
    }
  }

  continue() {
    this.data = this.form.value.items;
    _.remove(this.data, (item: any) => {
      return item.email == '' || item.name == '';
    });
    // status to current object
    _.forEach(this.data, (item: any, index: number) => {
      this.data[index] = {...item, status: 'new'};
    });
    this.modal.close(null).then();
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:open_subscription_update_modal',
      payload: {mode: 'edit',
        data: this.data,
        accountAction: 'add',
        accounts: this.accounts,
        subscription: {
          accountCount: this.noOfSub + this.noOfMaster,
          accountAmount: this.noOfSub*4.99 + this.noOfMaster*9.99,
          billingDate: moment()
        }
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
    let control = <FormArray>this.form.controls[this.type];

    this.changed(item, true);

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
    _.forEach((<FormArray>this.form.get(this.type)).controls, (item: any) => {
      if(item.controls.name.valid && item.controls.email.valid && item.controls.birthday.valid) {
        result = true;
        // this.countNoOfSubAndMaster(item.value);
      }
    });
    return result;
  }

  changed(item: any, countDown: boolean = false) {
    if(item.name.valid && item.email.valid && item.birthday.valid) {
      this.countNoOfSubAndMaster(item.parent_id.value, countDown);
    }
  }

  private countNoOfSubAndMaster(parent_id: any, countDown: boolean = false) {

    if(parent_id == null) {
      if(countDown)
        this.noOfMaster--;
      else
        this.noOfMaster++;
    }
    if(parent_id == 0) {
      if(countDown)
        this.noOfSub--;
      else
        this.noOfSub++;
    }

    if(this.noOfSub < 0)
      this.noOfSub = 0;

    if(this.noOfMaster < 0)
      this.noOfMaster = 0;
  }

}
