import { Component, OnInit }   from '@angular/core';
import { Router }                from '@angular/router';

import { UserService } from '@shared/services/user.service';
import { MyTransactionService } from './transaction/transaction.service';
import { LoadingService } from '@shared/shared/components/loading/loading.service';

@Component({
  moduleId: module.id,
  selector: 'billing-list',
  templateUrl: 'billing-list.component.html'
})

export class BillingListComponent implements OnInit {
  transactions: any[] = [];

  constructor(private userService: UserService,
              private transactionService: MyTransactionService,
              private loadingService: LoadingService,
              private router: Router) {
  }

  ngOnInit(): void {
    // this.loadingService.start();
    this.transactionService.list(this.userService.getSyncProfile().id)
      .subscribe((response: any) => {
          this.transactions = response.data;
          this.transactions.map((t) => {
            t.created_at = new Date(t.created_at);
          });
          // this.loadingService.stop();
        },
        (error: any) => {
          console.log('Billing history error', error);
          // this.loadingService.stop();
        });
  }

  viewReceipt(trans_id: string, event: any): void {
    event.preventDefault();
    this.router.navigate([`transactions/${trans_id}/receipt`]);
    return;
  }
}
