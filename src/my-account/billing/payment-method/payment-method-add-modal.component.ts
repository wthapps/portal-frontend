import { Component, Output, Input, ViewChild, HostBinding, OnInit, EventEmitter, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import { environment } from '@env/environment';
import { CreditCardValidator } from '@account/shared/credit-card';

declare const adyen: any;

@Component({
  selector: 'payment-method-add-modal',
  templateUrl: 'payment-method-add-modal.component.html'
})

export class PaymentMethodAddModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onSaved = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  options: any;
  pmType = 'card';
  pmForm: FormGroup;
  holderName: AbstractControl;
  number: AbstractControl;
  expiryMonth: AbstractControl;
  expiryYear: AbstractControl;
  cvc: AbstractControl;
  generationtime: AbstractControl;
  defaultOptions: {
    data: null,
    mode: 'add' | 'edit'
  };
  pm: any;
  mode: string;

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {

  }

  ngOnInit() {

    this.pmForm = this.fb.group({
      holderName: ['HUYNH DOAN THINH', [Validators.required]],
      number: ['', [Validators.required, CreditCardValidator.validateCardNumber]],
      expiryMonth: ['10', [Validators.required, CreditCardValidator.validateExpiryMonth]],
      expiryYear: ['2020', [Validators.required]],
      cvc: ['737', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      generationtime: [null, [Validators.required]]
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
  open(options: any = {data: undefined, mode: 'add'}) {
    this.options = Object.assign({}, this.defaultOptions, options);
    this.pm = this.options.data;
    this.pmForm.controls.generationtime.setValue(this.pm.generation_time);
    if (options.mode === 'edit') {

      this.pmForm.controls.number.setValue(`**** **** **** ${this.pm.object_json.last4Number}`);
    }

    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }


  save() {
    const key = environment.keys.adyen_public_key;
    let options = {cardTypeElement: null};
    let postData = {};
    let form    = document.getElementById('adyen-encrypted-form');
    const cseInstance = adyen.encrypt.createEncryption(key, options);

    // Bind encryption to the form
    let encryptedForm = adyen.encrypt.createEncryptedForm(form, key, options);

    postData['card'] = cseInstance.encrypt(this.pmForm.value);

    encryptedForm.addCardTypeDetection(options.cardTypeElement);

    if (this.options.mode === 'edit') {
      postData['card'] = {expiryMonth: this.expiryMonth.value, expiryYear: this.expiryYear.value};
    }
    this.onSaved.emit({paymentMethod: {...this.pm, ...postData}, mode: this.options.mode});
  }
}
