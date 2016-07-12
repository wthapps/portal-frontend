import {Component, NgZone, OnInit}                  from '@angular/core';
import {Router, ROUTER_DIRECTIVES, RouteSegment}    from '@angular/router';
import {FormBuilder, Validators, FormGroup}    from '@angular/common';
import {Cookie}                       from 'ng2-cookies/ng2-cookies';
import {PaymentService}               from './payment.service';
import {CountryListComponent}         from '../../shared/services/country.component';
import {
  UserService,
  WthConstants,
  LoadingService,
  ToastsService
}                                     from '../../shared/index';
import {CreditCard}                   from "../../shared/models/credit-card.model";
import {BillingAddress}               from "../../shared/models/billing-address.model";


@Component({
  moduleId: module.id,
  templateUrl: 'payment-edit.component.html',
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

export class PaymentEditComponent implements OnInit {
  PanelTitle:string = 'Find Services and add-ons';
  button_text:string = 'Continue';
  edit_mode:boolean = false;
  countries:any;
  paymentForm: FormGroup;
  credit_card: CreditCard = new CreditCard({billing_address: new BillingAddress({country_code_alpha2:''})});

  constructor(
    private _router:Router,
    private _userService:UserService,
    private _paymentService:PaymentService,
    private _countries:CountryListComponent,
    private _loaddingService:LoadingService,
    private _params:RouteSegment,
    private _toastsService:ToastsService,
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

  ngOnInit(): void {
    if (this._userService.profile.credit_cards != null) this.credit_card = this._userService.profile.credit_cards[0]
  }

  onCancel() {
    var next = this._params.getParam(WthConstants.string.next) === undefined ? '/account' :
               this._params.getParam(WthConstants.string.next).replace(/\%20/g, '\/');
    this._router.navigateByUrl(next);
  }


  private update(_this:any, body:string) {
    _this._paymentService.update(`users/${_this._userService.profile.id}/payments/1`, body)
      .subscribe((response) => {
          _this._loaddingService.stop();
          if (response.success) {
            _this._userService.profile.has_payment_info = true;
            _this._userService.profile.credit_cards = response.data.credit_cards;

            Cookie.set('profile', JSON.stringify(_this._userService.profile));
            _this._userService.profile = JSON.parse(Cookie.get('profile'));
            _this._toastsService.success(response.message);
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
}
