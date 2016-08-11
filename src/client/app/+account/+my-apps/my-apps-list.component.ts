import {
  Component,
  OnInit
}                       from '@angular/core';

import { ApiBaseService, UserService } from '../../shared/index';


@Component({
  moduleId: module.id,
  templateUrl: 'my-apps-list.component.html',
  directives: [
  ]
})

export class MyAppsListComponent implements OnInit {
  pageTitle: string = 'App List';
  my_apps: any;

  errorMessage: string;

  my_apps: Array<any> = [];

  constructor(
    private apiService: ApiBaseService, private userService: UserService
  ) {
  }

  ngOnInit():void {
    this.apiService.get(`users/${this.userService.profile.id}/my-apps`).subscribe(
      (response:any) => {
        this.my_apps = response.data;
      },
      error => {
        this.errorMessage = <any>error
      }
    );
  }

}
