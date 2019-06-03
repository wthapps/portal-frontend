import { Component, OnInit } from '@angular/core';

import { ApiBaseService } from '@shared/services';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '@shared/constant';
import { SubscriptionService } from '@shared/common/subscription';
import { DatePipe } from "@angular/common";

@Component({
  selector: 'subscription-alert',
  templateUrl: 'subscription-alert.component.html',
  styleUrls: ['subscription-alert.component.scss']
})
export class SubscriptionAlertComponent implements OnInit {
  dashboardUrl = Constants.baseUrls.myAccount + '/dashboard';
  success = false;
  alertType: 'upgrading' | 'expiration' | 'canceling';
  title = '';
  message = '';
  subscription: any;

  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.alertType = params.alertType || 'upgrading';
      this.success = params.success === 'false' ? false : true;

    });

    // Get current subscription
    this.subscriptionService.getCurrent().subscribe(response => {
      this.subscription = response.data.attributes;
      this.setContent(this.alertType);
    });
  }


  private setContent(alertType: string) {
    switch (alertType) {
      case 'upgrading':
        this.title = 'Upgrade completed';
        this.message = `<p>With WTH PRO, you wil have full access to all WTHApps services</p>
        <p>Click on button below to continue.</p>`;

        break;
      case 'canceling':
        this.title = 'Subscription was canceled';
        this.message = `<p>You are still able to user this account until the end of subscription on 
                        ${ this.datePipe.transform(this.subscription.ended_bc_at, 'MMM dd, yyyy') }. 
                        After this, your account will be deleted after 60 days</p>
                        <p>For more information, please check our 
                        <a href="${Constants.baseUrls.app}/policies/term" target="_blank">Terms of Service</a></p>`;
        break;
    }
  }
}
