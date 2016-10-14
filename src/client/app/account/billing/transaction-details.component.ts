import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/index';
import { TransactionService }   from '../transaction.service';
//2 import { LoadingService } from '../../partials/loading/loading.service';


@Component({
  moduleId: module.id,
  templateUrl: 'transaction-details.component.html',
  providers: [
    TransactionService,
    //2 LoadingService
  ]
})

export class TransactionDetailsComponent implements OnInit {
  pageTitle: string = 'Transaction Details';
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

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              private transactionService: TransactionService
              //2 private loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.trans_id = params['id'];
    });

    //2 this.loadingService.start();
    this.transactionService.list(`users/${this.userService.profile.id}/transactions/${this.trans_id}`)
      .subscribe((response: any) => {
          this.transaction = response.data;
          this.transaction.created_at = new Date(response.data.created_at);
          //2 this.loadingService.stop();
        },
        error => {
          console.log('Receipt error', error);
          //2 this.loadingService.stop();
        });
  }

  viewReceipt(event: any): void {
    event.preventDefault();
    this.router.navigate([`account/transactions/${this.trans_id}/receipt`]);
    return;
  }
}
