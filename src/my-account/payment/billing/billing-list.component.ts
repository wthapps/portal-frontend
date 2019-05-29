import { Component, OnInit }   from '@angular/core';
import { Router }                from '@angular/router';

import { UserService } from '@shared/services/user.service';
import { TransactionService } from './transaction/transaction.service';
import { LoadingService } from '@shared/shared/components/loading/loading.service';

@Component({
  moduleId: module.id,
  selector: 'billing-list',
  templateUrl: 'billing-list.component.html'
})

export class BillingListComponent implements OnInit {
  transactions: any[] = [];

  constructor(private userService: UserService,
              private transactionService: TransactionService,
              private loadingService: LoadingService,
              private router: Router) {
  }

  ngOnInit(): void {
    // this.loadingService.start();
    this.transactionService.getAll()
      .subscribe((response: any) => {
          this.transactions = response.data;
        },
        (error: any) => {
          console.log('Billing history error', error);
          // this.loadingService.stop();
        });
  }

  viewReceipt(strId: string): void {
    this.router.navigate([`/payment/billings/transactions/${strId}`]);
    return;
  }
}
