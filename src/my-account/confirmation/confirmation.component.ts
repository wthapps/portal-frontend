import { Component, OnInit } from '@angular/core';

import { ApiBaseService } from '@shared/services';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '@shared/constant';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'sd-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  socialUrl = Constants.baseUrls.social;
  faqUrl = Constants.baseUrls.app + '/faq';
  profileUrl = Constants.baseUrls.myAccount + '/settings/profile';
  confirmed = false;
  constructor(
    private apiBaseService: ApiBaseService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params.t;
      if (token === 'undefined') {
        this.confirmed = false;
        // this.toastsService.danger('Invalid confirmation to confirm your email address');
      } else {
        console.log('params:::', params);
        this.apiBaseService.get(`users/confirmation?confirmation_token=${token}`)
          .subscribe(response => {
            this.confirmed = true;
            // this.toastsService.success('Your email address confirmed successfully');
          }, error => {
            // this.toastsService.danger(error.error.error);
            this.confirmed = false;
        });
      }
    });
  }
}
