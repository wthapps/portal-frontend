import { Component, OnInit } from '@angular/core';
import { ApiBaseService, AuthService } from '@shared/services';
import { SubscriptionService } from '@shared/common/subscription/subscription.service';
import { StorageService } from '@shared/common/storage';
import { PaymentMethodService } from '@account/payment/payment-method/payment-method.service';
import { PlanService } from '@shared/common/plan';

declare let moment: any;

@Component({
  selector: 'current-subscription',
  templateUrl: 'current-subscription.component.html'
})

export class CurrentSubscriptionComponent implements OnInit {
  subscription: any;
  editing;
  plan: any;
  paymentMethod: any;

  constructor(
    private authService: AuthService,
    private subscriptionService: SubscriptionService,
    private planService: PlanService,
    private storageService: StorageService,
    private paymentMethodService: PaymentMethodService,
  ) {

  }

  ngOnInit() {
    this.getCurrentSubscription();
    this.getCurrentPlan();
    this.getCurrentPaymentMethod();
  }

  getCurrentSubscription() {
    this.subscriptionService.getCurrent().subscribe(response => {
        this.subscription = response.data.attributes;
        if (response.data.next_billing_date === null) {
          this.subscription.next_billing_date = moment().add(1, 'months');
        }
      }
    );
  }

  getCurrentPlan() {
    this.planService.getCurrent().subscribe(response => {
        this.plan = response.data;
      }
    );
  }

  getCurrentPaymentMethod() {
    this.paymentMethodService.getCurrent().subscribe(response => {
        this.paymentMethod = response.data;
      }
    );
  }

}
