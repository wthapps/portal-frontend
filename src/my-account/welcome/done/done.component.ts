import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Constants } from '@wth/shared/constant/config/constants';
import { AuthService, UserService } from '@wth/shared/services';

@Component({
  moduleId: module.id,
  selector: 'page-welcome-done',
  templateUrl: 'done.component.html',
  styleUrls: ['done.component.scss']
})

export class WelcomeDoneComponent implements OnInit {
  navigateUrl: string = Constants.baseUrls.social + '/my-profile';

  constructor(private authService: AuthService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    if (this.authService.user && !this.authService.user.took_a_tour) {
      let body = JSON.stringify({
        took_a_tour: true
      });

      this.userService.update(body).subscribe(
        (res: any) => {
          console.log(res);
        });

    } else {
      this.router.navigate(['/settings/profile']);
    }
  }
}
