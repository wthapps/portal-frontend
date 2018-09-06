import { Component, OnInit } from '@angular/core';

import { ApiBaseService } from '@shared/services';
import { ActivatedRoute } from '@angular/router';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'sd-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  constructor(
    private apiBaseService: ApiBaseService,
    private route: ActivatedRoute,
    private toastsService: ToastsService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params.t;
      if (token === 'undefined') {
        this.toastsService.danger('Invalid confirmation to confirm your email address');
      } else {
        console.log('params:::', params);
        this.apiBaseService.get(`users/confirmation?confirmation_token=${token}`)
          .subscribe(response => {
            this.toastsService.success('Your email address confirmed successfully');
          }, error => {
            this.toastsService.danger(error.error.error);
        });
      }
    });
  }
}
