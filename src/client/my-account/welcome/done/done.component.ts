import { Component, OnInit } from '@angular/core';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';

@Component({
  moduleId: module.id,
  selector: 'page-welcome-done',
  templateUrl: 'done.component.html',
  styleUrls: ['done.component.css']
})

export class WelcomeDoneComponent implements OnInit {
  constructor(private userService: UserService,
              private apiBaseService: ApiBaseService) {

  }

  ngOnInit(): void {
    if (!this.userService.profile.took_a_tour) {
      this.apiBaseService
        .put(`zone/social_network/users/${this.userService.profile.uuid}`, {'took_a_tour': true})
        .subscribe(
          (res: any) => {
            console.log(res);
          });
    }
  }
}
