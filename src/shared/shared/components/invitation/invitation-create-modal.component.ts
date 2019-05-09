import { ToastsService } from './../toast/toast-message.service';
import { InvitationService } from './invitation.service';
import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '../../validator/custom.validator';

declare var _: any;

@Component({
  selector: 'invitation-create-modal',
  styleUrls: ['invitation-create-modal.component.scss'],
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
  back = false;

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
    this.back = options.back;
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
        firstName: [item.firstName, Validators.compose([Validators.required, CustomValidator.blanked])],
        lastName: [item.lastName, Validators.compose([Validators.required, CustomValidator.blanked])],
        contactId: [item.contactId]
      });
    } else {
      return this.fb.group({
        email: ['', Validators.compose([Validators.required, CustomValidator.emailFormat])],
        firstName: ['', Validators.compose([Validators.required, CustomValidator.blanked])],
        lastName: ['', Validators.compose([Validators.required, CustomValidator.blanked])],
        contactId: [null]
      });
    }
  }

  add(item?: any) {
    const control = <FormArray>this.form.controls[this.type];
    if (item) {
      control.push(this.create(item));
    } else {
      control.push(this.create());
    }
  }

  onBack() {
    this.event.emit({ action: 'back' });
    let control = <FormArray>this.form.get(this.type);
    this.removeAll();
  }


  doEvent(options: any) {
    let data = this.form.value.items;
    switch (options.action) {
      case 'invitation:send_to_recipients':
        // remove items whose email is empty
        _.remove(data, (item: any) => {
          // if (item.email !== '') {
          //   item.firstName = item.email.split('@')[0];
          // }
          return item.email === '';
        });
        options['payload'] = data;
        this.modal.close();
        data.map(r => {
          if (r.firstName !== '' && r.lastName !== '') {
            r.fullName = `${r.firstName} ${r.lastName}`;
          }
        });
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
        this.event.emit({ action: 'invitation:send_successfully', payload: response.data });
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
      if (item.email !== '' && item.fistName !== '' && item.lastName !== '') {
        result = true;
      }
    });
    return result;
  }
}
