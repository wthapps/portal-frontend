import { Component, OnInit }   from '@angular/core';
import { Router }                from '@angular/router';

import { UserService } from '../../../core/shared/services/user.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { ACTransactionService } from '../shared/transaction.service';

@Component({
  moduleId: module.id,
  selector: 'ac-billing-history',
  templateUrl: 'history.component.html'
})

export class ACBillingHistoryComponent implements OnInit {
  pageTitle: string = 'Billing History';
  transactions: any[] = [];

  constructor(private userService: UserService,
              private transactionService: ACTransactionService,
              private loadingService: LoadingService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadingService.start();
    this.transactionService.list(this.userService.profile.id)
      .subscribe((response: any) => {
          this.transactions = response.data;
          this.transactions.map((t) => {
            t.created_at = new Date(t.created_at);
          });
          this.loadingService.stop();
        },
        (error: any) => {
          console.log('Billing history error', error);
          this.loadingService.stop();
        });
  }

  viewReceipt(trans_id: string, event: any): void {
    event.preventDefault();
    this.router.navigate([`transactions/${trans_id}/receipt`]);
    return;
  }
}
