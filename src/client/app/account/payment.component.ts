import {Component, AfterViewInit, NgZone}                          from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteSegment}                   from '@angular/router';
import {FormBuilder, Validators, FormGroup}    from '@angular/common';
import {PaymentService}               from './payment.service';
import {CountryListComponent}         from '../shared/services/country.component';
import {
  UserService,
  WthConstants,
  LoadingService,
  TopMessageService
}                                     from '../shared/index';
import {Cookie}                       from 'ng2-cookies/ng2-cookies';

declare var braintree:any;

@Component({
  moduleId: module.id,
  templateUrl: 'payment.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    PaymentService,
    UserService,
    CountryListComponent,
    LoadingService
  ]
})

export class PaymentComponent implements AfterViewInit {
  PanelTitle:string = 'Find Services and add-ons';
  button_text:string = 'Continue';
  edit_mode:boolean = false;
  countries:any;
  paymentForm: FormGroup;

  constructor(
    private _router:Router,
    private _userService:UserService,
    private _paymentService:PaymentService,
    private _countries:CountryListComponent,
    private _loaddingService:LoadingService,
    private _params:RouteSegment,
    private _toastsService:TopMessageService,
    private _builder: FormBuilder,
    private _zone: NgZone
  ) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${WthConstants.string.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    this.countries = this._countries.countries;


    // initialize billing details info
    let action = _params.getParam('operation');
    switch (action) {
      case undefined:
        this._userService.profile.billing_address = {
          address_line_1: '',
          address_line_2: '',
          country: '',
          city: '',
          postcode: '',
          region: ''
        };
        this._userService.profile.credit_cards = [{
          last_4: '',
          card_type: '',
          cardholder_name: '',
        }];
        break;
      case WthConstants.operations.edit:
        this.button_text = 'Update';
        this.edit_mode = true;
        break;

    }

    this.paymentForm = this._builder.group({
      cardholder_name: ['', Validators.compose([Validators.required])
      ],
      address_line_1: ['', Validators.compose([Validators.required])
      ],
      city: ['', Validators.compose([Validators.required])
      ],
      region: ['', Validators.compose([Validators.required])
      ],
      country: ['', Validators.compose([Validators.required])
      ]
    });
  }

  topMessageShow():void {
    this._toastsService.danger('');
  }

  ngAfterViewInit() {

    var _this = this;
    var form:any = document.querySelector('#payment-method-card');
    var submit = document.querySelector('#button-pay');


    // billing address information
    var cardholder_name = $('#cardholder-name');
    var address_line_1 = $('#address-line-1');
    var address_line_2 = $('#address-line-2');
    var city = $('#city');
    var region = $('#region');
    var postcode = $('#postcode');
    var country = $('#country');

    braintree.client.create({
      //authorization: 'sandbox_g42y39zw_348pk9cgf3bgyw2b'
      authorization: 'sandbox_s2jx657k_szyg6zhyvyn2grsq'
    }, function (err, clientInstance) {
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
      }, function (err, hostedFieldsInstance) {
        if (err) {
          console.error(err);
          return;
        }

        hostedFieldsInstance.on('validityChange', function (event) {
          // Check if all fields are valid, then show submit button
          var formValid = Object.keys(event.fields).every(function (key) {
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

        hostedFieldsInstance.on('empty', function (event) {
          //$('header').removeClass('header-slide');
          $('#card-image').removeClass();
          $(form).removeClass();
        });

        hostedFieldsInstance.on('cardTypeChange', function (event) {
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

        submit.addEventListener('click', function (event) {
          event.preventDefault();

          hostedFieldsInstance.tokenize(function (err, payload) {
            if (err) {
              _this._toastsService.danger(err.message);
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
    var next = this._params.getParam(WthConstants.string.next) === undefined ? '/account' :
               this._params.getParam(WthConstants.string.next).replace(/\%20/g, '\/');
    this._router.navigateByUrl(next);
  }

  /**
   *  Add card information and billing address
   */
  private create(_this:any, body:string) {
    _this._paymentService.create(`users/${_this._userService.profile.id}/payments`, body)
    // _this._userService.signup(`users/${_this._userService.profile.id,}/payments`, body)
      .subscribe((response) => {
          _this._loaddingService.stop();
          if (response.success) { // TODO refactor this code in server
            _this._userService.profile.has_payment_info = true;
            _this._userService.profile.credit_cards = response.data.credit_cards;
            _this._userService.profile.billing_address = response.data.billing_address;

            Cookie.set('profile', JSON.stringify(_this._userService.profile));
            // make sure onInit method on PlansComponent will work
            _this._zone.run(() => {
              _this._router.navigate(['/account/plans']);
            });

            return;
          }
          _this._toastsService.danger(response.message);
        },
        error => {
          _this._loaddingService.stop();
          _this._toastsService.danger(error);
          console.log('Add card error:', error);
        });
    _this._loaddingService.start();
  }


  private update(_this:any, body:string) {
    _this._paymentService.update(`users/${_this._userService.profile.id}`, body)
      .subscribe((response) => {
          _this._loaddingService.stop();
          if (response.success) {
            _this._userService.profile.has_payment_info = true;
            _this._userService.profile.credit_cards = response.data.credit_cards;
            _this._userService.profile.billing_address = response.data.billing_address;
            Cookie.set('profile', JSON.stringify(_this._userService.profile));
            _this._userService.profile = JSON.parse(Cookie.get('profile'));
            _this._toastsService.success(response.message);
            return;
          }
          _this._toastsService.danger(response.message);
        },
        error => {
          _this._loaddingService.stop();
          _this._toastsService.danger(_this._toastsService.type.danger, error);
          console.log('Add card error:', error);
        });
    _this._loaddingService.start();
  }
}
