import { Component, NgZone, OnInit }                  from '@angular/core';
import { Router, ActivatedRoute }    from '@angular/router';
import { FormBuilder, Validators, FormGroup }    from '@angular/forms';
// import {Cookie}                       from 'ng2-cookies/ng2-cookies';
import { PaymentService }               from './payment.service';
import {
  UserService,
  Constants,
  //2 LoadingService,
  ToastsService,
  CountryService
}                                     from '../../shared/index';
import { CreditCard }                   from '../../shared/models/credit-card.model';
// import {BillingAddress}               from '../../shared/models/billing-address.model';


@Component({
  moduleId: module.id,
  templateUrl: 'payment-edit.component.html',
  providers: [
    PaymentService,
    CountryService
  ]
})

export class PaymentEditComponent implements OnInit {
  PanelTitle: string = 'Find Services and add-ons';
  button_text: string = 'Continue';
  edit_mode: boolean = false;
  errorMessage: string = '';
  countriesCode: any;
  paymentForm: FormGroup;
  credit_card: CreditCard = null;

  private action: string = '';
  private next: string = '';

  constructor(private _router: Router,
              private _userService: UserService,
              private _paymentService: PaymentService,
              private countryService: CountryService,
              //2 private _loaddingService:LoadingService,
              private route: ActivatedRoute,
              private toastsService: ToastsService,
              private _builder: FormBuilder,
              private _zone: NgZone) {
    this.countryService.getCountries().subscribe(
      data => this.countriesCode = data,
      error => this.errorMessage = <any>error);
  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.action = params['operation'];
      this.next = params[Constants.params.next];
    });
    switch (this.action) {
      case undefined:
        break;
      case Constants.operations.edit:
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

    if (this._userService.profile.credit_cards.length > 0) this.credit_card = this._userService.profile.credit_cards[0];
  }

  onCancel() {
    var next = this.next === undefined ? '/account' : this.next.replace(/\%20/g, '\/');
    this._router.navigateByUrl(next);
  }


  // private update(_this:any, body:string) {
  //   _this._paymentService.update(`users/${_this._userService.profile.id}/payments/1`, body)
  //     .subscribe((response) => {
  //         _this._loaddingService.stop();
  //         if (response.success) {
  //           _this._userService.profile.has_payment_info = true;
  //           _this._userService.profile.credit_cards = response.data.credit_cards;

  //           Cookie.set('profile', JSON.stringify(_this._userService.profile));
  //           _this._userService.profile = JSON.parse(Cookie.get('profile'));
  //           _this.toastsService.success(response.message);
  //           return;
  //         }
  //         _this.toastsService.danger(response.message);
  //       },
  //       error => {
  //         _this._loaddingService.stop();
  //         _this.toastsService.danger(error);
  //         console.log('Add card error:', error);
  //       });
  //   _this._loaddingService.start();
  // }
}
