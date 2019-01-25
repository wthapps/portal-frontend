import { Component, OnInit } from '@angular/core';

import { ApiBaseService, UserService } from '../../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../../../shared/constant';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  selector: 'email-update',
  templateUrl: 'update.component.html',
  styleUrls: ['update.component.scss']
})
export class UpdateComponent implements OnInit {
  faqUrl = Constants.baseUrls.app + '/faq';
  profileUrl = Constants.baseUrls.myAccount + '/settings/profile';
  confirmed = false;
  user: any;
  message = 'Updating your email address...';
  loaded = false;

  constructor(
    private apiBaseService: ApiBaseService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const token = params.token;
      if (token === 'undefined') {
        this.confirmed = false;
        // this.toastsService.danger('Invalid confirmation to confirm your email address');
      } else {
        this.apiBaseService.get(`account/users/email/update?token=${token}`)
          .subscribe(response => {
            this.loaded = true;
            this.confirmed = true;
            this.user = this.userService.getSyncProfile();
            this.user.email = response.data.email;
            this.userService.updateProfile(this.user);
            this.message = 'Your email address successfully updated';
          }, error => {
            this.message = error.error.error;
            this.confirmed = false;
            this.loaded = true;
        });
      }
    });
  }
}
