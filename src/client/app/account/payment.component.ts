import {Component, AfterViewInit}     from '@angular/core';
import {Router, ROUTER_DIRECTIVES}    from '@angular/router';
import {PaymentService}               from './payment.service';
import {UserService}                  from '../shared/services/user.service';
import {CountryListComponent}         from '../shared/services/country.component';

declare var braintree:any;

@Component({
  moduleId: module.id,
  templateUrl: 'payment.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    PaymentService,
    CountryListComponent
  ]
})

export class PaymentComponent implements AfterViewInit {
  PanelTitle:string = 'Find Services and add-ons';

  countries:any;

  constructor(
    private _router:Router,
    private _userService:UserService,
    private _paymentService:PaymentService,
    private _countries:CountryListComponent
  ) {
    this.countries = this._countries.countries;
  }

  ngAfterViewInit() {

    var _this = this;
    var form = document.querySelector('#payment-method-card');
    var submit = document.querySelector('input[type="submit"]');

    // billing address information
    var cardholder_name = $("#cardholder-name");
    var address_line_1 = $("#address-line-1");
    var address_line_2 = $("#address-line-2");
    var city = $("#city");
    var region = $("#region");
    var postcode = $("#postcode");
    var country = $("#country");

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
            'color': '#282c37',
            'font-size': '16px',
            'transition': 'color 0.1s',
            'line-height': '3'
          },
          // Style the text of an invalid input
          'input.invalid': {
            'color': '#E53A40'
          },
          // placeholder styles need to be individually adjusted
          '::-webkit-input-placeholder': {
            'color': 'rgba(0,0,0,0.6)'
          },
          ':-moz-placeholder': {
            'color': 'rgba(0,0,0,0.6)'
          },
          '::-moz-placeholder': {
            'color': 'rgba(0,0,0,0.6)'
          },
          ':-ms-input-placeholder ': {
            'color': 'rgba(0,0,0,0.6)'
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

          if (formValid) {
            //$('#button-pay').addClass('show-button');
            $('#button-pay').prop("disabled", false);
          } else {
            //$('#button-pay').removeClass('show-button');
            $('#button-pay').prop("disabled", true);
          }
        });

        hostedFieldsInstance.on('empty', function (event) {
          $('header').removeClass('header-slide');
          $('#card-image').removeClass();
          $(form).removeClass();
        });

        hostedFieldsInstance.on('cardTypeChange', function (event) {
          // Change card bg depending on card type
          if (event.cards.length === 1) {
            $(form).removeClass().addClass(event.cards[0].type);
            $('#card-image').removeClass().addClass(event.cards[0].type);
            $('header').addClass('header-slide');

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
              console.error(err);
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
              zipcode: "",
              region: region.val(),
              country: country.val()
          });
            _this._paymentService.create(`users/${_this._userService.profile.id}/payments`, body)
              .subscribe((response) => {
                  if(response.data == null){

                  }else {
                    _this._router.navigateByUrl('account/plans');
                  }
                },
                error => {
                  console.log("Add card error:", error);
                });
          });
        }, false);
      });
    });
  }

  /**
   *  Add card information and billing address
   */
  public create(name, number, month, year, cvv, address, city, state, zipcode, country) {
    let body = JSON.stringify({
      cardholder_name: name,
      number,
      expiration_date: `${month}/${year}`,
      cvv,
      address,
      city,
      zipcode,
      state,
      country
    });
    let user_id = this._userService.profile.id;
    this._paymentService.create(`/users/${user_id}/payments`, body)
      .subscribe((result) => {
          this._router.navigateByUrl('account');
        },
        error => {
          console.log("error:", error);
        });
  }
}
