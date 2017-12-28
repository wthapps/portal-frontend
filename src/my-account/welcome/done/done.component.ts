import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@wth/shared/services/user.service';
import { Constants } from '@wth/shared/constant/config/constants';

@Component({
  moduleId: module.id,
  selector: 'page-welcome-done',
  templateUrl: 'done.component.html',
  styleUrls: ['done.component.scss']
})

export class WelcomeDoneComponent implements OnInit {
  navigateUrl: string = Constants.baseUrls.social + '/my-profile';

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.userService.profile && !this.userService.profile.took_a_tour) {
      let body = JSON.stringify({
        took_a_tour: true
      });

      this.userService.update(`users/${this.userService.profile.id}`, body).subscribe(
        (res: any) => {
          console.log(res);
        });

    } else {
      this.router.navigate(['/settings/profile']);
    }
  }
}
