import { ToastsService } from './../toast/toast-message.service';
import { InvitationService } from './invitation.service';
import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '../../validator/custom.validator';

declare var _: any;

@Component({
  selector: 'invitation-create-modal',
  templateUrl: 'invitation-create-modal.component.html'
})

export class InvitationCreateModalComponent implements OnInit {
  @Input() data: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: BsModalComponent;

  form: FormGroup;
  deleteObjects: any = [];
  type = 'items';
  noOfCtrl = 3;

  constructor(private fb: FormBuilder,
    private invitationService: InvitationService,
    private toaster: ToastsService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      'items': this.fb.array([])
    });
    // this.initialize();
  }

  open(options?: any) {
    if (options.data === undefined) {
      this.initialize();
    } else {
      this.data = options.data;
      this.fillData();
    }
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  initialize() {
    const control = <FormArray>this.form.get(this.type);
    for (let i = 0; i < control.controls.length; i++)
      control.removeAt(0);
    for (let i = 0; i < this.noOfCtrl; i++) {
      this.add();
    }
  }

  fillData() {
    if (this.data) {
      for (let i = 0; i < this.data.length; i++) {
        this.add(this.data[i]);
      }
    }
  }

  create(item?: any) {
    if (item) {
      return this.fb.group({
        email: [item.email, Validators.compose([Validators.required, CustomValidator.emailFormat])],
        fullName: [item.fullName, Validators.compose([Validators.required])],
        contactId: [item.contactId]
      });
    } else {
      return this.fb.group({
        email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])],
        fullName: ['', Validators.compose([Validators.required])],
        contactId: [null]
      });
    }
  }

  add(item?: any) {
    const control = <FormArray>this.form.controls[this.type];
    if (item) {
      control.insert(0, this.create(item));
    } else {
      control.insert(0, this.create());
    }
  }


  doEvent(options: any) {
    const data = this.form.value.items;
    switch (options.action) {
      case 'invitation:send_to_recipients':
        // remove items whose email is empty
        _.remove(data, (item: any) => {
          if (item.email !== '') {
            item.fullName = item.email.split('@')[0];
          }
          return item.email === '';
        });
        options['payload'] = data;
        this.modal.close();
        this.sendInvitations(data);
        this.removeAll();
        // this.event.emit(options);
        break;
      case 'cancel':
        this.modal.close(null);
        this.removeAll();
        break;
      default:
        break;
    }
  }

  done(values: any) {
    this.data = _.concat(this.deleteObjects, values);
    this.event.emit(this.data);
  }

  remove(i: number, item: any) {
    const control = <FormArray>this.form.controls[this.type];
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

  sendInvitations(data: any): Promise<any> {
    return this.invitationService
      .create({ recipients: data })
      .toPromise().then((response: any) => {
        // this.invitationModal.close();
        this.toaster.success(
          'You have just sent invitation(s) successfully!'
        );
      });
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
    _.forEach(this.form.value.items, (item: any) => {
      if (item.email !== '' && item.fullName !== '') {
        result = true;
      }
    });
    return result;
  }
}
