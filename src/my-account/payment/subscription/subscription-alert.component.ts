import { Component, OnInit } from '@angular/core';

import { ApiBaseService } from '@shared/services';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '@shared/constant';

@Component({
  selector: 'subscription-alert',
  templateUrl: 'subscription-alert.component.html',
  styleUrls: ['subscription-alert.component.scss']
})
export class SubscriptionAlertComponent implements OnInit {
  dashboardUrl = Constants.baseUrls.myAccount + '/dashboard';
  success = false;
  alertType: 'upgrading' | 'expiration' | 'canceling';

  constructor(
    private apiBaseService: ApiBaseService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.alertType = params.alertType || 'upgrading';
      this.success = params.success === 'false' ? false : true;
    });
  }
}
