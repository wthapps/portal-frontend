import { Component, AfterViewInit, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators
} from '@angular/forms';

import { Constants } from '../../core/shared/config/constants';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CookieOptionsArgs } from 'angular2-cookie/services/cookie-options-args.model';

import { ACPaymentService } from './payment.service';
import { CreditCard } from '../../core/shared/models/credit-card.model';
import { UserService } from '../../core/shared/services/user.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { CountryService } from '../../core/partials/countries/countries.service';
import { LoadingService } from '../../core/partials/loading/loading.service';
import { ToastsService } from '../../core/partials/toast/toast-message.service';
import { BillingAddress } from '../../core/shared/models/billing-address.model';

declare var braintree: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'ac-payment',
  templateUrl: 'payment.component.html'
})

export class ACPaymentComponent implements AfterViewInit, OnInit {
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

  private cookieOptionsArgs: CookieOptionsArgs = Constants.cookieOptionsArgs;

  constructor(private cookieService: CookieService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private paymentService: ACPaymentService,
              private apiBaseService: ApiBaseService,
              private countryService: CountryService,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private builder: FormBuilder,
              private zone: NgZone) {
  }

  ngOnInit(): void {

    this.selected_plan = JSON.parse(this.cookieService.get('selected_plan'));

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
    var _thisPayment = this;
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


              if (formValid && _thisPayment.paymentForm.valid) {
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
                  _thisPayment.toastsService.danger(err.message);
                  console.log('payment', err);
                  return;
                }

                // This is where you would submit payload.nonce to your server
                let body = JSON.stringify({
                  type: 'credit',
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

                if (_thisPayment.edit_mode) {
                  _thisPayment.update(_thisPayment, body);
                } else {
                  _thisPayment.create(_thisPayment, body);
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
                flow: 'vault', //'checkout', //'vault', // This enables the Vault flow
                //billingAgreementDescription: 'Where is my money',
                locale: 'en_CA',
                enableShippingAddress: false,
                shippingAddressEditable: false,
              }, function (tokenizeErr: any, payload: any) {

                // This is where you would submit payload.nonce to your server
                let body = JSON.stringify({
                  type: 'paypal',
                  nonce: payload.nonce
                });

                if (_thisPayment.edit_mode) {
                  _thisPayment.update(_thisPayment, body);
                } else {
                  _thisPayment.create(_thisPayment, body);
                }
                // Send tokenizationPayload.nonce to server
                // _thisPayment.apiBaseService.post('payment/paypal/checkout', {nonce: payload.nonce}).subscribe(
                //   (res:any) => {
                //     _thisPayment.toastsService.success('success');
                //   }
                // )
              });
            });
          });
        });
      }
    );
  }


  changePaymentMethod(element: any) {
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
  private create(_thisPayment: any, body: string) {
    _thisPayment.loadingService.start();

    _thisPayment.paymentService.create(`users/${_thisPayment.userService.profile.id}/payments`, body)
    // _thisPayment._userService.signup(`users/${_thisPayment._userService.profile.id,}/payments`, body)
      .subscribe((response: any) => {
          _thisPayment.loadingService.stop();
          if (response.success) { // TODO refactor this code in server
            _thisPayment.userService.profile.has_payment_info = true;
            // _thisPayment.userService.profile.credit_cards = response.data.credit_cards;
            _thisPayment.userService.defaultPayment = response.user.default_payment;

            // Cookie.delete('profile');
            this.cookieService.put('profile', JSON.stringify(_thisPayment.userService.profile), this.cookieOptionsArgs);
            _thisPayment.userService.profile = JSON.parse(this.cookieService.get('profile'));
            // make sure onInit method on PlansComponent will work
            _thisPayment.zone.run(() => {
              _thisPayment.router.navigate(['/account/payment/confirm']);
            });

            return;
          }
          _thisPayment.toastsService.danger(response.message);
        },
        (error: any) => {
          _thisPayment.loadingService.stop();
          _thisPayment.toastsService.danger(error);
          console.log('Add card error:', error);
        });
  }


  private update(_thisPayment: any, body: string) {
    _thisPayment.paymentService.update(`users/${_thisPayment.userService.profile.id}/payments/1`, body)
      .subscribe((response: any) => {
          _thisPayment.loadingService.stop();
          if (response.success) {
            _thisPayment.userService.profile.has_payment_info = true;
            _thisPayment.userService.profile.credit_cards = response.data.credit_cards;
            // Cookie.delete('profile');
            this.cookieService.put('profile', JSON.stringify(_thisPayment.userService.profile), this.cookieOptionsArgs);
            _thisPayment.userService.profile = JSON.parse(this.cookieService.get('profile'));
            _thisPayment.toastsService.success(response.message);
            return;
          }
          _thisPayment.toastsService.danger(response.message);
        },
        (error: any) => {
          _thisPayment.loadingService.stop();
          _thisPayment.toastsService.danger(error);
          console.log('Add card error:', error);
        });
    _thisPayment.loadingService.start();
  }


}



