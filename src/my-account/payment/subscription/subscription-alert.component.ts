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
  upgradeUrl = Constants.baseUrls.myAccount + '/subscription/upgrade';
  title = '';
  message = '';
  subscription: any;
  success = false;
  warning = false;

  readonly TRIAL_DAY_NUM = 30;
  readonly DELETED_DAY_NUM = 60;
  readonly UPGRADING = 'upgrading';
  readonly EXPIRED = 'expired';
  readonly CANCELING = 'canceling';
  readonly CANCELED = 'canceled';
  alertType: 'upgrading' | 'expired' | 'canceling' | 'canceled';


  constructor(
    private route: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.alertType = params.alertType || this.UPGRADING;
      this.success = params.success === 'false' ? false : true;
      // Get current subscription
      this.subscriptionService.getCurrent().subscribe(response => {
        this.subscription = response.data.attributes;
        this.setContent(this.alertType);
      });
    });
  }


  private setContent(alertType: string) {
    switch (alertType) {
      case this.UPGRADING:
        this.title = 'Upgrade completed';
        this.message = `<p>With WTH PRO, you wil have full access to all WTHApps services</p>
        <p>Click on button below to continue.</p>`;

        break;
      case this.CANCELING:
        this.title = 'Subscription was canceled';
        this.message = `<p>You are still able to user this account until the end of subscription on 
                        ${ this.datePipe.transform(this.subscription.ended_bc_at, 'MMM dd, yyyy') }. 
                        After this, your account will be deleted after ${ this.DELETED_DAY_NUM } days</p>
                        <p>For more information, please check our 
                        <a href="${Constants.baseUrls.app}/policies/term" target="_blank">Terms of Service</a></p>`;
        break;
      case this.CANCELED:
        this.title = 'Subscription expired';
        this.message = `<p>Your subscription was expired. To continue using WTHApps, you need to renew your subscription 
                        by clicking on the button below</p>
                        <p>After ${ this.DELETED_DAY_NUM } days of expiration, all of your WTHApps data will be permanently deleted.
                        For more information, visit our
                        <a href="${Constants.baseUrls.app}/policies/term" target="_blank">Terms of Service</a>
                        and <a href="${Constants.baseUrls.app}/policies/privacy" target="_blank">Privacy & Cookie Policy</a></p>`;
        break;
      case this.EXPIRED:
        this.title = 'Trial expired';
        this.message = `<p>Your ${ this.TRIAL_DAY_NUM } days trail had expired. To continue using WTHApps, you need to upgrade to PRO plan.</p>
                        <p>After ${ this.DELETED_DAY_NUM } days of expiration, all of your WTHApps data will be permanently deleted.
                        For more information, visit our
                         <a href="${Constants.baseUrls.app}/policies/term" target="_blank">Terms of Service</a>
                        and <a href="${Constants.baseUrls.app}/policies/privacy" target="_blank">Privacy & Cookie Policy</a></p>`;
        break;
    }
  }
}
