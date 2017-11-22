import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'page-welcome',
  templateUrl: 'welcome.component.html',
  styleUrls: ['welcome.component.css']
})

export class WelcomeComponent implements OnInit {

  pageTitle: string = 'Welcome Page';

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    console.log(this.userService.profile);
    if (this.userService.profile.took_a_tour) {
      this.router.navigate(['/my-profile'])
    }
  }
}
