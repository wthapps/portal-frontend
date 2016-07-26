import {Component, OnInit}   from '@angular/core';
import {ROUTER_DIRECTIVES, Router}                from '@angular/router';
import {
  UserService,
  LoadingService
}                                                 from '../shared/index';
import {TransactionService}                       from './transaction.service';



@Component({
  moduleId: module.id,
  templateUrl: 'billing-history.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    TransactionService,
    LoadingService
  ]
})

export class BillingHistoryComponent implements OnInit {
  pageTitle:string = 'Billing History';
  transactions: any[] = [];

  constructor(
    private _userService:UserService,
    private _router:Router,
    private _transactionService: TransactionService,
    private _loadingService: LoadingService
  ) {
  }

  ngOnInit(): void {
    this._loadingService.start();
    this._transactionService.list(`users/${this._userService.profile.id}/transactions`)
      .subscribe((response:any) => {
        this.transactions = response.data;
        this.transactions.map((t) => {
          t.created_at = new Date(t.created_at);
        });
        this._loadingService.stop();
        },
        error => {
          console.log('Billing history error', error);
          this._loadingService.stop();
        });
  }

  viewReceipt(trans_id: string, event: any): void {
    event.preventDefault();
    this._router.navigate([`account/transactions/${trans_id}/receipt`]);
    return;
  }
}
