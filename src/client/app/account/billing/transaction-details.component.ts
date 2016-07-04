import {Component, OnInit, Pipe, PipeTransform,
  ElementRef
}                                                 from '@angular/core';
import {ROUTER_DIRECTIVES, Router, RouteSegment}  from '@angular/router';
import {UserService, CONFIG}                      from '../../shared/index';
import {TransactionService}                       from '../transaction.service';
import {LoadingService}                           from '../../partials/loading/loading.service';


@Component({
  moduleId: module.id,
  templateUrl: 'transaction-details.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    TransactionService,
    LoadingService
  ]
})

export class TransactionDetailsComponent implements OnInit{
  pageTitle:string = 'Transaction details';
  transaction: any = {
    amount: 0,
    merchant: '',
    currency_iso_code: '',
    created_at: new Date(),
    updated_at: '',
    status: '',
    type: '',
    payment_instrument_type: '',
    billing_address: {
      street_address: '',
      extended_address: '',
      region: '',
      postal_code: '',
      locality: '',
      country_name: ''
    },
    customer: {
      firt_name: '',
      last_name: '',
      email: ''
    },
    credit_card: {
      last_4: '',
      card_type: '',
      cardholder_name: ''
    }
  };
  trans_id: string;

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _routeSegment: RouteSegment,
    private _transactionService: TransactionService,
    private _loadingService: LoadingService,
    private _el:ElementRef
  ) {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }
    this.trans_id = this._routeSegment.getParam('id');
    console.log(this.trans_id);
  }

  ngOnInit(): void {
    this.trans_id = this._routeSegment.getParam('id');
    this._loadingService.start();
    this._transactionService.list(`users/${this._userService.profile.id}/transactions/${this.trans_id}`)
      .subscribe((response) => {
          this.transaction = response.data;
          this.transaction.created_at = new Date(response.data.created_at);
          this._loadingService.stop();
        },
        error => {
          console.log("Receipt error", error);
          this._loadingService.stop();
        });
  }

  viewReceipt(event: any): void {
    event.preventDefault();
    this._router.navigate([`account/transactions/${this.trans_id}/receipt`]);
    return;
  }
}
