import {Component, AfterViewInit, NgZone, OnInit}     from '@angular/core';
import {Router, ROUTER_DIRECTIVES, ActivatedRoute}    from '@angular/router';
import {
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators }                        from '@angular/forms';
import {Cookie}                       from 'ng2-cookies/ng2-cookies';
import {PaymentService}               from './payment.service';
import {CountryListComponent}         from '../../shared/services/country.component';
import {
  UserService,
  Constants,
  LoadingService,
  ToastsService
}                                     from '../../shared/index';

import {CreditCard}                   from '../../shared/models/credit-card.model';
import {BillingAddress}               from '../../shared/models/billing-address.model';

declare var braintree:any;

@Component({
  moduleId: module.id,
  templateUrl: 'payment.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ],
  providers: [
    PaymentService,
    UserService,
    CountryListComponent,
    LoadingService
  ]
})

export class PaymentComponent implements AfterViewInit, OnInit {
  PanelTitle:string = 'Find Services and add-ons';
  button_text:string = 'Continue';
  edit_mode:boolean = false;
  countries:any;
  credit_card: CreditCard = null;
  submitted: boolean = false;

  paymentForm: FormGroup;
  cardholder_name: AbstractControl = null;
  address_line_1: AbstractControl = null;
  address_line_2: AbstractControl = null;
  city: AbstractControl = null;
  country: AbstractControl = null;
  region: AbstractControl = null;
  postcode: AbstractControl = null;

  private next: string = '';
  private operation: string = '';


  constructor(
    private router:Router,
    private route: ActivatedRoute,
    private userService:UserService,
    private paymentService:PaymentService,
    private countryService: CountryListComponent,
    private loaddingService:LoadingService,
    private toastsService:ToastsService,
    private builder: FormBuilder,
    private zone: NgZone

  ) {

  }

  topMessageShow():void {
    this.toastsService.danger('');
  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
       this.next = params['next'];
       this.operation = params['operation'];
    });
    if (!this.userService.loggedIn) {
      this.router.navigateByUrl(
        `/login;${Constants.string.next}=${this.router.location.path().replace(/\//g, '\%20')}`
      );
    }

    // initialize billing details info
    switch (this.operation) {
      case undefined:
        break;
      case Constants.operations.edit:
        this.button_text = 'Update';
        this.edit_mode = true;
        break;
    }

    // get data
    this.countries = this.countryService.countries;
    if (this.userService.profile.credit_cards.length > 0) {
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
      cardholder_name: [this.credit_card.cardholder_name, Validators.compose([Validators.required])],
      address_line_1: [this.credit_card.billing_address.street_address, Validators.compose([Validators.required])],
      address_line_2: [this.credit_card.billing_address.extended_address, null],
      city: [this.credit_card.billing_address.locality, Validators.compose([Validators.required])],
      region: [this.credit_card.billing_address.region, Validators.compose([Validators.required])],
      postcode: [this.credit_card.billing_address.postcode, Validators.compose([Validators.required])],
      country: [this.credit_card.billing_address.country_code_alpha2, Validators.compose([Validators.required])]
    });

    this.cardholder_name = this.paymentForm.controls['cardholder_name'];
    this.address_line_1 = this.paymentForm.controls['address_line_1'];
    this.address_line_2 = this.paymentForm.controls['address_line_2'];
    this.city = this.paymentForm.controls['city'];
    this.region = this.paymentForm.controls['region'];
    this.postcode = this.paymentForm.controls['postcode'];
    this.country = this.paymentForm.controls['country'];
  }

  ngAfterViewInit() {

    var _this = this;
    var form:any = document.querySelector('#payment-method-card');
    var submit = document.querySelector('#button-pay');


    // billing address information
    var cardholder_name = $('#cardholder_name');
    var address_line_1 = $('#address_line_1');
    var address_line_2 = $('#address_line_2');
    var city = $('#city');
    var region = $('#region');
    var postcode = $('#postcode');
    var country = $('#country');

    braintree.client.create({
      //authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
      authorization: 'sandbox_s2jx657k_szyg6zhyvyn2grsq'
    }, function (err: any, clientInstance: any) {
      if (err) {
        console.error(err);
        return ;
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

          console.log('this', _this.paymentForm.valid);

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
    });
  }

  onCancel() {
    var next = this.next === undefined ? '/account' : this.next.replace(/\%20/g, '\/');
    this.router.navigateByUrl(next);
  }

  onSubmit() {
    this.submitted = true;
  }
  /**
   *  Add card information and billing address
   */
  private create(_this:any, body:string) {
    _this.paymentService.create(`users/${_this.userService.profile.id}/payments`, body)
    // _this._userService.signup(`users/${_this._userService.profile.id,}/payments`, body)
      .subscribe((response) => {
          _this.loaddingService.stop();
          if (response.success) { // TODO refactor this code in server
            _this.userService.profile.has_payment_info = true;
            _this.userService.profile.credit_cards = response.data.credit_cards;

            Cookie.set('profile', JSON.stringify(_this.userService.profile));
            _this.userService.profile = JSON.parse(Cookie.get('profile'));
            // make sure onInit method on PlansComponent will work
            _this.zone.run(() => {
              _this.router.navigate(['/account/plans']);
            });

            return;
          }
          _this.toastsService.danger(response.message);
        },
        error => {
          _this.loaddingService.stop();
          _this.toastsService.danger(error);
          console.log('Add card error:', error);
        });
    _this.loaddingService.start();
  }


  private update(_this:any, body:string) {
    _this.paymentService.update(`users/${_this.userService.profile.id}/payments/1`, body)
      .subscribe((response) => {
          _this.loaddingService.stop();
          if (response.success) {
            _this.userService.profile.has_payment_info = true;
            _this.userService.profile.credit_cards = response.data.credit_cards;

            Cookie.set('profile', JSON.stringify(_this.userService.profile));
            _this.userService.profile = JSON.parse(Cookie.get('profile'));
            _this.toastsService.success(response.message);
            return;
          }
          _this.toastsService.danger(response.message);
        },
        error => {
          _this.loaddingService.stop();
          _this.toastsService.danger(error);
          console.log('Add card error:', error);
        });
    _this.loaddingService.start();
  }
}
