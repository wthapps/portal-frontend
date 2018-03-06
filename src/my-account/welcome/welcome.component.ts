import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '@wth/shared/constant/config/constants';
import { AuthService, UserService } from '@wth/shared/services';

@Component({
  moduleId: module.id,
  selector: 'page-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.scss']
})

export class WelcomeComponent implements OnInit {

  pageTitle: string = 'Welcome Page';
  navigateUrl: string = Constants.baseUrls.social + '/my-profile';

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.authService.user && this.authService.user.took_a_tour) {
      this.router.navigate(['/settings/profile']);
    }
  }

  onNoThanks() {
    if (this.authService.user && !this.authService.user.took_a_tour) {
      let body = JSON.stringify({
        took_a_tour: true
      });

      this.userService.update(body).subscribe(
        (res: any) => {
          window.location.href = this.navigateUrl;
        });

    }
  }
}
