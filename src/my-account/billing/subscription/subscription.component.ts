import { Component, OnInit } from '@angular/core';
import { ApiBaseService, AuthService } from '@shared/services';
declare let moment: any;

@Component({
  moduleId: module.id,
  selector: 'my-subscription',
  templateUrl: 'subscription.component.html'
})

export class MySubscriptionComponent implements OnInit {
  subscription: any;
  plan: any;
  paymentMethod: any;

  constructor(private authService: AuthService, private apiBaseService: ApiBaseService) {

  }

  ngOnInit() {
    this.getCurrentSubscription(this.authService.user);
    this.getCurrentPlan(this.authService.user);
    this.getCurrentPaymentMethod(this.authService.user);
  }

  getCurrentSubscription(user: any) {
    this.apiBaseService.get(`account/accounts/${user.id}/subscription`).subscribe(
      (response: any) => {
        this.subscription = response.data;
        if (response.data.next_billing_date === null) {
          this.subscription.next_billing_date = moment().add(1, 'months');
        }
      }
    );
  }

  getCurrentPlan(user: any) {
    this.apiBaseService.get(`account/accounts/${user.id}/plan`).subscribe(
      (response: any) => {
        this.plan = response.data;
      }
    );
  }

  getCurrentPaymentMethod(user: any) {
    this.apiBaseService.get(`account/accounts/${user.id}/payment_method`).subscribe(
      (response: any) => {
        this.paymentMethod = response.data[0];
      }
    );
  }

}
