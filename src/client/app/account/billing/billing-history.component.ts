import { Component, OnInit }   from '@angular/core';
import { Router }                from '@angular/router';
import {
  UserService,
  LoadingService
}                                                 from '../../shared/index';
import { TransactionService }                       from '../transaction.service';


@Component({
  moduleId: module.id,
  templateUrl: 'billing-history.component.html',
  providers: [
    TransactionService
  ]
})

export class BillingHistoryComponent implements OnInit {
  pageTitle: string = 'Billing History';
  transactions: any[] = [];

  constructor(private userService: UserService,
              private router: Router,
              private transactionService: TransactionService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.loadingService.start();
    this.transactionService.list(`users/${this.userService.profile.id}/transactions`)
      .subscribe((response: any) => {
          this.transactions = response.data;
          this.transactions.map((t) => {
            t.created_at = new Date(t.created_at);
          });
          this.loadingService.stop();
        },
        error => {
          console.log('Billing history error', error);
          this.loadingService.stop();
        });
  }

  viewReceipt(trans_id: string, event: any): void {
    event.preventDefault();
    this.router.navigate([`account/transactions/${trans_id}/receipt`]);
    return;
  }
}
