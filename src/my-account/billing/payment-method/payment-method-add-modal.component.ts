import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { ApiBaseService } from '@shared/services';
// import * as adyen from 'adyen-cse-web';

declare const adyen: any;

@Component({
  moduleId: module.id,
  selector: 'payment-method-add-modal',
  templateUrl: 'payment-method-add-modal.component.html'
})

export class PaymentMethodAddModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  options: any;
  pmType = 'card';
  pmForm: FormGroup;
  holderName: AbstractControl;
  number: AbstractControl;
  expiryMonth: AbstractControl;
  expiryYear: AbstractControl;
  cvc: AbstractControl;
  generationtime: AbstractControl;

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {

  }

  ngOnInit() {
    this.pmForm = this.fb.group({
      holderName: ['HUYNH DOAN THINH', [Validators.required]],
      number: ['2222 4000 7000 0005', [Validators.required]],
      expiryMonth: ['10', [Validators.required]],
      expiryYear: ['2020', [Validators.required]],
      cvc: ['737', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      generationtime: [(new Date()).toISOString(), [Validators.required]]
    });
    this.holderName = this.pmForm.controls.holderName;
    this.number = this.pmForm.controls.number;
    this.expiryMonth = this.pmForm.controls.expiryMonth;
    this.expiryYear = this.pmForm.controls.expiryYear;
    this.cvc = this.pmForm.controls.cvc;
    this.generationtime = this.pmForm.controls.generationtime;

  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'edit'}) {
    this.options = options;
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  inputNumber(event: any) {
    const cardType = adyen.cardtype.determine(event.target.value);
    console.log('inputNumber:::', event.target, cardType);
  }

  add() {
    const key = '10001|BD56A321C8083026355A289AD273D26415C410A4921A1D6F10C6CDED438140DB09A72E8D3D48256BA470D9A02331FBB0CF2C42BF5CFE7F53FA5F7B2939EFA69A9347A68339B7EADD87B7FD9CDFB23D1F222F100B7D64BF661E28F8B8FF08FF5F643A1BFF1609C0F67426C42C3FA44315C9E93EA5663C39B71F60B1388AFB3A5714962B77C876FC6F6A4DD8D4CC572D9111CDC53D09FE54EF2FDBA44608BF745A795C19DA09C1BAE4A53D25484E1878AFA0ED88B8C7E877D706B5A428CC40C11280CEFB4ACCCCC8D00ADD8DB70248BF2E35FF32D5753525C64673EEE4F949C117626F3692F2E0FEB9682B3A4DDD60D8503E9B276668E6B2CDF33D31734FE8C9B5';
    let options = {cardTypeElement: null};
    let postData = {};
    let form    = document.getElementById('adyen-encrypted-form');
    const cseInstance = adyen.encrypt.createEncryption(key, options);
    options.cardTypeElement = document.getElementById('cardtype');

    console.log('add payment method:::', adyen);
    console.log('add payment method:::', form);
    // Bind encryption to the form
    let encryptedForm = adyen.encrypt.createEncryptedForm(form, key, options);

    postData['card'] = cseInstance.encrypt(this.pmForm.value);

    encryptedForm.addCardTypeDetection(options.cardTypeElement);

    console.log('postData:::', postData);
    console.log('encryptedForm:::', form);

    this.apiBaseService.post('account/payment_methods', postData)
      .subscribe(response => {
      console.log('add payment method:::', response.data);
    });

  }

  choosePMType(element: any) {
      this.pmType = element.value;
  }

}
