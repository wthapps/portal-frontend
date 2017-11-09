import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CustomValidator } from '../../../../core/shared/validator/custom.validator';
import { Constants } from '../../../../core/shared/config/constants';

declare var _: any;
declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'account-edit-modal',
  templateUrl: 'account-edit-modal.component.html',
  styleUrls: ['account-edit-modal.component.css']
})

export class AccountEditModalComponent implements OnInit {
  @Input() data: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;
  fullName: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  tooltip: any = Constants.tooltip;


  constructor(private fb: FormBuilder) {

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
      this.initialize();
    // } else {
    //   this.data = options.data;
    //   this.fillData();
    // }
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  initialize() {
    if(this.form == undefined) {
      this.form = this.fb.group({
        'fullName': ['', Validators.compose([
          Validators.required
        ])],
        'email': ['', Validators.compose([
          Validators.required
        ])],
        'password': ['', Validators.compose([
          Validators.required,
          Validators.minLength(8),
          CustomValidator.lowercaseUppercase,
          CustomValidator.specialSymbolOrNumber
        ])]
      });

      this.fullName = this.form.controls['fullName'];
      this.email = this.form.controls['email'];
      this.password = this.form.controls['password'];
    }

  }

  fillData() {

  }


  done(values: any) {

  }

  togglePassword(event: any): void {
    var target = event.target || event.srcElement || event.currentTarget;
    let inputPass = $(target).prev();
    if (inputPass.attr('type') == 'password') {
      inputPass.attr('type', 'text');
      $(target).addClass('active');
    } else {
      inputPass.attr('type', 'password');
      $(target).removeClass('active');
    }
  }

}
