import { Component, OnInit } from '@angular/core';

import { ApiBaseService } from '@shared/services';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '@shared/constant';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'upgrade-completion',
  templateUrl: 'upgrade-completion.component.html',
  styleUrls: ['upgrade-completion.component.scss']
})
export class UpgradeCompletionComponent implements OnInit {
  dashboardUrl = Constants.baseUrls.myAccount + '/dashboard';
  success = false;
  constructor(
    private apiBaseService: ApiBaseService,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.success = params.success === 'false' ? false : true;
    });
  }
}
