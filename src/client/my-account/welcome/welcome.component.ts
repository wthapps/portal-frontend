import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/shared/services/user.service';
import { Router } from '@angular/router';
import { Constants } from '../../core/shared/config/constants';

@Component({
  moduleId: module.id,
  selector: 'page-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.css']
})

export class WelcomeComponent implements OnInit {

  pageTitle: string = 'Welcome Page';
  navigateUrl: string = Constants.baseUrls.social + '/my-profile';

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log(this.userService.profile);
    if (this.userService.profile.took_a_tour) {
      this.router.navigate(['/settings/profile'])
    }
  }

  onNoThanks() {
    if (!this.userService.profile.took_a_tour) {
      let body = JSON.stringify({
        took_a_tour: true
      });

      this.userService.update(`users/${this.userService.profile.id}`, body).subscribe(
        (res: any) => {
          console.log(res);
          window.location.href = this.navigateUrl;
        });

    }
  }
}
