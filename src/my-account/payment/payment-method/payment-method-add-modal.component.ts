import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { PaymentMethodService } from './payment-method.service';
import { PaymentGatewayService } from '@account/shared/payment-gateway';

declare const braintree: any;

@Component({
  selector: 'payment-method-add-modal',
  templateUrl: 'payment-method-add-modal.component.html',
  styleUrls: ['payment-method-add-modal.component.scss'],
})

export class PaymentMethodAddModalComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onCompleted = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<any>();

  mode: string;
  title: string;
  submitButton: any;
  loading = false;
  private token: string;
  private dropin: any;

  constructor(
    private paymentGatewayService: PaymentGatewayService,
    private paymentMethodService: PaymentMethodService
  ) {

  }

  ngOnInit() {

    // Get token
    this.paymentGatewayService.getToken().subscribe(response => {
      this.token = response.data.token;
    });
  }

  /*
  * @parameter: option: object
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {mode: 'add'}) {
    this.mode = options.mode;
    this.initializeForm(this.mode);
    if (options.mode === 'edit') {
      this.title = 'Change';
    } else {
      this.title = 'Add';
    }

    this.modal.open(options).then();
  }

  close(options?: any) {
    this.loading = false;
    this.modal.close(options).then(() => {
      this.destroyDropIn();
    });
  }

  private initializeForm(mode: string = 'add') {
    this.loading = true;
    this.submitButton = document.querySelector('#submit-payment-method');

    braintree.dropin.create({
      authorization: this.token,
      container: '#card-container'
    }).then(dropinInstance => {
      this.dropin = dropinInstance;
      // dropinInstance.clearSelectedPaymentMethod();
      this.loading = false;
      this.submitButton.addEventListener('click', () => {
        this.dropin.requestPaymentMethod().then(payload => {
          // Send payload to server
          this.close();
          this.submitPayload(payload);
        }).catch(error => {
          this.handleUpsertError(error);
        });

        this.dropin.on('noPaymentMethodRequestable', () => {
          this.submitButton.setAttribute('disabled', 'true');
        });

        this.dropin.on('paymentMethodRequestable', event => {
          // if the nonce is already available (via PayPal authentication
          // or by using a stored payment method), we can request the
          // nonce right away. Otherwise, we wait for the customer to
          // request the nonce by pressing the submit button once they
          // are finished entering their credit card details
          this.submitButton.removeAttribute('disabled');
        });

        // this.dropin.on('paymentOptionSelected', event => {
        // });

      });
    }).catch(error => {
      this.loading = false;
      this.handleUpsertError(error);
    });
  }

  destroyDropIn() {
    if (this.dropin) {
      this.dropin.teardown(error => {
        if (error) {
          console.log('Dropin teardown:::', error);
        }
        this.dropin = null;
      });
    }
  }


  private submitPayload(payload: any) {
    this.paymentMethodService.create(payload).subscribe(response => {
      this.onCompleted.emit({ success: true, data: response.data });
    }, error => {
      this.onCompleted.emit(error.error);
    });
  }

  // Handle any errors that might've occurred when creating Drop-in
  private handleUpsertError(error: any) {
    this.submitButton.setAttribute('disabled', 'true');
    return;
  }

}
