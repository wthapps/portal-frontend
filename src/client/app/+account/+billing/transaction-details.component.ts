import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router, ActivatedRoute}  from '@angular/router';
import {UserService, Constants}                      from '../../shared/index';
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

export class TransactionDetailsComponent implements OnInit {
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
  trans_id: string = '';

  constructor(
    private userService:UserService,
    private router:Router,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private loadingService: LoadingService
  ) {
    if (!this.userService.loggedIn) {
      this.router.navigateByUrl(
        `/login;${Constants.params.next}=${this.router.location.path().replace(/\//g, '\%20')}`
      );
    }
  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.trans_id = params['id'];
    });

    this.loadingService.start();
    this.transactionService.list(`users/${this.userService.profile.id}/transactions/${this.trans_id}`)
      .subscribe((response) => {
          this.transaction = response.data;
          this.transaction.created_at = new Date(response.data.created_at);
          this.loadingService.stop();
        },
        error => {
          console.log('Receipt error', error);
          this.loadingService.stop();
        });
  }

  viewReceipt(event: any): void {
    event.preventDefault();
    this.router.navigate([`account/transactions/${this.trans_id}/receipt`]);
    return;
  }
}
