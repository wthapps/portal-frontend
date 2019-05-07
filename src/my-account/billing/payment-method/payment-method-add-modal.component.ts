import {
  Component,
  enableProdMode,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import { environment } from '@env/environment';

declare const $: any;
declare const AdyenCheckout: any;

@Component({
  selector: 'payment-method-add-modal',
  templateUrl: 'payment-method-add-modal.component.html',
  styleUrls: ['payment-method-add-modal.component.scss'],
})

export class PaymentMethodAddModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onSaved = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  options: any;
  pmType = 'card';
  holderName: AbstractControl;
  defaultOptions: {
    data: null,
    mode: 'add' | 'edit'
  };
  pm: any;
  mode: string;
  title: string;

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {

  }

  ngOnInit() {
  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'add'}) {
    this.options = Object.assign({}, this.defaultOptions, options);
    this.pm = this.options.data;
    this.mode = options.mode;

    this.initializeForm(this.mode);
    if (options.mode === 'edit') {
      this.title = 'Update';
    } else {
      this.title = 'Add';
    }

    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then(
      $('div.adyen-checkout__card-input').remove()
    );
  }


  save() {
    const key = environment.keys.adyen_public_key;
    let options = {cardTypeElement: null};
    let postData = {};
    if (this.options.mode === 'edit') {
    }
    this.onSaved.emit({paymentMethod: {...this.pm, ...postData}, mode: this.options.mode});
  }

  private initializeForm(mode: string = 'add') {
    // if (mode === 'add') {

    //   });
    // } else if (mode === 'edit') {

    // }



    function handleOnChange(state: any, component: any) {

    }
    const configuration = {
      locale: 'en_US',
      originKey: environment.keys.adyen_origin_key,
      loadingContext: 'https://checkoutshopper-test.adyen.com/checkoutshopper/'
    };

    const checkout = new AdyenCheckout(configuration);
    // Define style object
    const styleObject = {
      base: {
        color: '#555555'
      },
      error: {
        color: '#d9534f'
      },
      placeholder: {
        color: '#d8d8d8'
      }
    };

    // Create card params
    // https://docs.adyen.com/payment-methods/cards/#configuring-the-component
    const card = checkout.create('card', {
      styles: styleObject,
      hasHolderName: true,
      holderNameRequired: true,
      holderName: 'test card',
      placeholders: {
        encryptedCardNumber : '4111 1111 1111 1111',
        encryptedExpiryDate : 'MM/YY',
        encryptedSecurityCode : 'CVC/CVV'
      },
      onChange: (state: any, component: any) => {
        console.log('handle changed card:::', state, component);
        // state.isValid // true or false.
        // state.data
        /* {type: "scheme",
            encryptedCardNumber: "adyenjs_0_1_18$MT6ppy0FAMVMLH...",
            encryptedExpiryMonth: "adyenjs_0_1_18$MT6ppy0FAMVMLH...",
            encryptedExpiryYear: "adyenjs_0_1_18$MT6ppy0FAMVMLH...",
            encryptedSecurityCode: "adyenjs_0_1_18$MT6ppy0FAMVMLH..."}
        */
      },
    }).mount('#card-container');
    if (!card.isValid()) {
      card.showValidation();
      return false;
    }}
}
