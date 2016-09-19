import {
  Component,
  OnInit
}                           from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                           from '@angular/router';

import {
  UserService,
  ApiBaseService
}                           from '../../shared/index';
import {ServicesService}    from '../+services/services.service';


@Component({
  moduleId: module.id,
  selector: 'account-menu',
  templateUrl: 'account-menu.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [ServicesService, ApiBaseService]
})
export class AccountMenuComponent implements OnInit {
  has_installed_apps: boolean = false;
  installed_apps: any = [];

  constructor(private appsService: ServicesService, private userService: UserService) {
  }

  ngOnInit(): void {
    // load installed apps list
    // this.appsService.getUserProducts().subscribe(
    //   response => {
    //     this.has_installed_apps = response.length > 0 ? true : false;
    //     this.installed_apps = response;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }
}


