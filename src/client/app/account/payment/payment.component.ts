import { Component, AfterViewInit, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators
} from '@angular/forms';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { PaymentService } from './payment.service';
import {
  UserService,
  Constants,
  LoadingService,
  ToastsService,
  CountryService
} from '../../shared/index';

import { CreditCard } from '../../shared/models/credit-card.model';
import { BillingAddress } from '../../shared/models/billing-address.model';
import { ApiBaseService } from '../../shared/services/apibase.service';

declare var braintree: any;
declare var $: any;

@Component({
  moduleId: module.id,
  templateUrl: 'payment.component.html',
  providers: [
    PaymentService,
    CountryService
  ]
})

export class PaymentComponent implements AfterViewInit, OnInit {
  PanelTitle: string = 'Find Services and add-ons';
  button_text: string = 'Add Payment Method';
  edit_mode: boolean = false;
  errorMessage: string = '';
  countriesCode: any;
  credit_card: CreditCard = null;
  submitted: boolean = false;

  paymentForm: FormGroup;
  payment_method: AbstractControl = null;
  cardholder_name: AbstractControl = null;
  address_line_1: AbstractControl = null;
  address_line_2: AbstractControl = null;
  city: AbstractControl = null;
  country: AbstractControl = null;
  region: AbstractControl = null;
  postcode: AbstractControl = null;

  selected_plan: any = null;
  private next: string = '';
  private operation: string = '';
  private paymentMethod: string = 'credit';


  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private paymentService: PaymentService,
              private apiBaseService : ApiBaseService,
              private countryService: CountryService,
              private loaddingService: LoadingService,
              private toastsService: ToastsService,
              private builder: FormBuilder,
              private zone: NgZone) {
  }

  ngOnInit(): void {

    this.selected_plan = JSON.parse(Cookie.get('selected_plan'));

    this.route.params.subscribe((params) => {
      this.next = params['next'];
      this.operation = params['operation'];
    });

    // initialize billing details info
    switch (this.operation) {
      case undefined:
        break;
      case Constants.operations.edit:
        this.button_text = 'Update Payment Method';
        this.edit_mode = true;
        break;
    }

    // get data
    this.countryService.getCountries().subscribe(
      data => this.countriesCode = data,
      error => this.errorMessage = <any>error);

    if ((this.userService.profile.credit_cards != null) && (this.userService.profile.credit_cards.length > 0)) {
      this.credit_card = this.userService.profile.credit_cards[0];
    } else {
      this.credit_card = new CreditCard({
        cardholder_name: '',
        billing_address: new BillingAddress({
          street_address: '',
          extended_address: '',
          postcode: '',
          region: '',
          locality: '',
          country_code_alpha2: ''
        })
      });
    }


    // Validation
    this.paymentForm = this.builder.group({
      payment_method: 'credit',
      cardholder_name: [this.credit_card.cardholder_name, Validators.compose([Validators.required])],
      address_line_1: [this.credit_card.billing_address.street_address, Validators.compose([Validators.required])],
      address_line_2: [this.credit_card.billing_address.extended_address, null],
      city: [this.credit_card.billing_address.locality, Validators.compose([Validators.required])],
      region: [this.credit_card.billing_address.region, Validators.compose([Validators.required])],
      postcode: [this.credit_card.billing_address.postcode, Validators.compose([Validators.required])],
      country: [this.credit_card.billing_address.country_code_alpha2, Validators.compose([Validators.required])]
    });

    this.payment_method = this.paymentForm.controls['payment_method'];
    this.cardholder_name = this.paymentForm.controls['cardholder_name'];
    this.address_line_1 = this.paymentForm.controls['address_line_1'];
    this.address_line_2 = this.paymentForm.controls['address_line_2'];
    this.city = this.paymentForm.controls['city'];
    this.region = this.paymentForm.controls['region'];
    this.postcode = this.paymentForm.controls['postcode'];
    this.country = this.paymentForm.controls['country'];
  }

  ngAfterViewInit() {
    let clientToken: string = '';
    var _this = this;
    var form: any = document.querySelector('#payment-method-card');
    var submit = document.querySelector('#button-pay');
    var paypalButton = document.querySelector('#paypal-button');


    // billing address information
    var cardholder_name = $('#cardholder_name');
    var address_line_1 = $('#address_line_1');
    var address_line_2 = $('#address_line_2');
    var city = $('#city');
    var region = $('#region');
    var postcode = $('#postcode');
    var country = $('#country');


    // getting payment token
    this.apiBaseService.get(`users/payments/client_token?type=${this.paymentMethod}`).subscribe(
      (response: any) => {
        clientToken = response.data;

        braintree.client.create({
          //authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
          authorization: clientToken
        }, function (err: any, clientInstance: any) {
          if (err) {
            console.error(err);
            return;
          }

          // Create input fields and add text styles
          braintree.hostedFields.create({
            client: clientInstance,
            styles: {
              'input': {
                'display': 'block',
                'width': '100%',
                'height': '34px',
                'padding': '6px 12px',
                'font-size': '14px',
                'line-height': '1.428571429',
                'color': '#555555',
                'background-color': '#fff',
                'background-image': 'none',
                'border': '1px solid #ccc',
                'border-radius': '4px',
                '-webkit-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
                '-moz-box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
                'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)',
                '-webkit-transition': 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
                '-moz-transition': 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s',
                'transition': 'border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s'
              },
              // Style the text of an invalid input
              'input.invalid': {
                'color': '#E53A40'
              },
              // placeholder styles need to be individually adjusted
              '::-webkit-input-placeholder': {
                'color': '#999'
              },
              ':-moz-placeholder': {
                'color': '#999'
              },
              '::-moz-placeholder': {
                'color': '#999'
              },
              ':-ms-input-placeholder ': {
                'color': '#999'
              }

            },
            // Add information for individual fields
            fields: {
              number: {
                selector: '#card-number',
                placeholder: '4111 1111 1111 1111'
              },
              cvv: {
                selector: '#cvv',
                placeholder: '123'
              },
              expirationDate: {
                selector: '#expiration-date',
                placeholder: '10 / 2019'
              }
            }
          }, function (err: any, hostedFieldsInstance: any) {
            if (err) {
              console.error(err);
              return;
            }

            hostedFieldsInstance.on('validityChange', function (event: any) {
              // Check if all fields are valid, then show submit button
              var formValid = Object.keys(event.fields).every(function (key: any) {
                return event.fields[key].isValid;
              });


              if (formValid && _this.paymentForm.valid) {
                //$('#button-pay').addClass('show-button');
                $('#button-pay').prop('disabled', false);
              } else {
                //$('#button-pay').removeClass('show-button');
                $('#button-pay').prop('disabled', true);
              }
            });

            hostedFieldsInstance.on('empty', function (event: any) {
              //$('header').removeClass('header-slide');
              $('#card-image').removeClass();
              $(form).removeClass();
            });

            hostedFieldsInstance.on('cardTypeChange', function (event: any) {
              // Change card bg depending on card type
              if (event.cards.length === 1) {
                $(form).removeClass().addClass(event.cards[0].type);
                $('#card-image').removeClass().addClass(event.cards[0].type);
                //$('header').addClass('header-slide');

                // Change the CVV length for AmericanExpress cards
                if (event.cards[0].code.size === 4) {
                  hostedFieldsInstance.setPlaceholder('cvv', '1234');
                }
              } else {
                hostedFieldsInstance.setPlaceholder('cvv', '123');
              }
            });

            submit.addEventListener('click', function (event: any) {
              event.preventDefault();

              hostedFieldsInstance.tokenize(function (err: any, payload: any) {
                if (err) {
                  _this.toastsService.danger(err.message);
                  console.log('payment', err);
                  return;
                }

                // This is where you would submit payload.nonce to your server
                let body = JSON.stringify({
                  cardholder_name: cardholder_name.val(),
                  nonce: payload.nonce,
                  address_line_1: address_line_1.val(),
                  address_line_2: address_line_2.val(),
                  city: city.val(),
                  postcode: postcode.val(),
                  zipcode: '',
                  region: region.val(),
                  country: country.val()
                });

                if (_this.edit_mode) {
                  _this.update(_this, body);
                } else {
                  _this.create(_this, body);
                }

              });
            }, false);
          });

          braintree.paypal.create({
            client: clientInstance
          }, function (paypalErr: any, paypalInstance: any) {
            paypalButton.addEventListener('click', function (event: any) {
              // Tokenize here!
              paypalInstance.tokenize({
                flow: 'vault', // This enables the Vault flow
                billingAgreementDescription: 'Where is my money',
                locale: 'en_CA',
                enableShippingAddress: false,
                shippingAddressEditable: false,
              }, function (tokenizeErr: any, payload: any) {
                console.log('paypal payment');
                // Send tokenizationPayload.nonce to server
                // _this.apiBaseService.post('payment/paypal/checkout', {nonce: payload.nonce}).subscribe(
                //   (res:any) => {
                //     _this.toastsService.success('success');
                //   }
                // )
              });
            });
          });
        });
      }
    );
  }


  changePaymentMethod(element: any){
    this.paymentMethod = element.value;
  }


  /*onCancel() {
   var next = this.next === undefined ? '/account' : this.next.replace(/\%20/g, '\/');
   this.router.navigateByUrl(next);
   }*/

  onSubmit() {
    this.submitted = true;
  }

  /**
   *  Add card information and billing address
   */
  private create(_this: any, body: string) {
    _this.loaddingService.start();

    _this.paymentService.create(`users/${_this.userService.profile.id}/payments`, body)
    // _this._userService.signup(`users/${_this._userService.profile.id,}/payments`, body)
      .subscribe((response: any) => {
          _this.loaddingService.stop();
          if (response.success) { // TODO refactor this code in server
            _this.userService.profile.has_payment_info = true;
            _this.userService.profile.credit_cards = response.data.credit_cards;

            // Cookie.delete('profile');
            Cookie.set('profile', JSON.stringify(_this.userService.profile), 365, '/');
            _this.userService.profile = JSON.parse(Cookie.get('profile'));
            // make sure onInit method on PlansComponent will work
            _this.zone.run(() => {
              _this.router.navigate(['/account/payment/confirm']);
            });

            return;
          }
          _this.toastsService.danger(response.message);
        },
        (error: any) => {
          _this.loaddingService.stop();
          _this.toastsService.danger(error);
          console.log('Add card error:', error);
        });
  }


  private update(_this: any, body: string) {
    _this.paymentService.update(`users/${_this.userService.profile.id}/payments/1`, body)
      .subscribe((response: any) => {
          _this.loaddingService.stop();
          if (response.success) {
            _this.userService.profile.has_payment_info = true;
            _this.userService.profile.credit_cards = response.data.credit_cards;
            // Cookie.delete('profile');
            Cookie.set('profile', JSON.stringify(_this.userService.profile), 365, '/');
            _this.userService.profile = JSON.parse(Cookie.get('profile'));
            _this.toastsService.success(response.message);
            return;
          }
          _this.toastsService.danger(response.message);
        },
        (error: any) => {
          _this.loaddingService.stop();
          _this.toastsService.danger(error);
          console.log('Add card error:', error);
        });
    _this.loaddingService.start();
  }
}



