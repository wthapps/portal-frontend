import { Component, OnInit } from '@angular/core';

import { ApiBaseService, UrlService } from '@shared/services';
import { Router } from '@angular/router';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-confirmation',
  templateUrl: 'confirmation.component.html',
  styleUrls: ['confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  constructor(
    private apiBaseService: ApiBaseService,
    private urlService: UrlService,
    private router: Router
  ) {}
  ngOnInit() {
    this.apiBaseService
      .get(`users/confirmation?confirmation_token=${this.urlService.getId()}`)
      .subscribe((res: any) => {
        if (res.data.verified) {
          this.router.navigate(['/settings/profile'], {
            queryParams: { verified: true }
          });
        } else {
          this.router.navigate(['/settings/profile?verified=false']);
        }
      });
  }
}
