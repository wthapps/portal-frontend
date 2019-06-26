import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, UserService } from '@shared/services';

@Component({
  selector: 'app-account-deleted',
  templateUrl: './account-deleted.component.html',
  styleUrls: ['account-deleted.component.scss']
})
export class AccountDeletedComponent implements OnInit {
  email: String = 'account@email.com';

  constructor(private route: ActivatedRoute,  private authService: AuthService, private userService: UserService) {
    route.queryParamMap.forEach(paramMap => {
      this.email = paramMap.get('email');
      this.userService.deleteUserInfo();
      this.authService.deleteAuthInfo();
    });
  }

  ngOnInit() {}
}
