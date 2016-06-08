import {
  Component,
  AfterViewInit
}                             from '@angular/core';
import {
  Router,
  ROUTER_DIRECTIVES
}                             from '@angular/router';
import {AccountMenuComponent} from '../menu/account-menu.component';
import {PaymentService}       from "../../account/payment/payment.service";
import {UserService}          from "../../shared/services/user.service";

declare var braintree:any;

@Component({
  moduleId: module.id,
  templateUrl: 'payment.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ],
  providers: [
    PaymentService
  ]
})

export class AccountAddCardComponent implements AfterViewInit {
  PanelTitle:string = 'Find Services and add-ons';

  constructor(private _router:Router, private _userService:UserService, private _paymentService:PaymentService) {
  }

  ngAfterViewInit() {
    var _this = this;

    var form = document.querySelector('#payment-method-card');
    var submit = document.querySelector('input[type="submit"]');

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
            placeholder: '1111 1111 1111 1111'
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
            // alert('Submit your nonce to your server here!'+ payload.nonce);
            _this._router.navigateByUrl('account/payment/confirm');
            /*_this._paymentService.create(`/users/1/payments`, '')
              .subscribe((result) => {
                  console.log('in-test');
                  _this._router.navigateByUrl('account/payment/confirm');
                },
                error => {
                  console.log("error:", error);
                });*/
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
