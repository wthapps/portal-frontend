import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '@shared/services/user.service';

import { TransactionService } from './transaction.service';
import { LoadingService } from '@shared/shared/components/loading/loading.service';

@Component({
  selector: 'my-transaction-detail',
  templateUrl: 'transaction-detail.component.html'
})

export class TransactionDetailComponent implements OnInit {
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
              private route: ActivatedRoute,
              private transactionService: TransactionService,
              private loadingService: LoadingService,
              private router: Router) {
  }

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.trans_id = params['id'];
    });

    // this.loadingService.start();
    this.transactionService.get(this.trans_id).subscribe(
      (response: any) => {
        this.transaction = response.data;
        // this.loadingService.stop();
      },
      (error: any) => {
        console.log('Receipt error', error);
        this.loadingService.stop();
      });
  }

  viewReceipt(event: any): void {
    event.preventDefault();
    this.router.navigate([`transactions/${this.trans_id}/receipt`]);
    return;
  }
}
