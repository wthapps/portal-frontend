import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/shared/services/user.service';
import { ACMyAppsService } from '../my-apps.service';

@Component({
  moduleId: module.id,
  selector: 'ac-my-apps-list',
  templateUrl: 'list.component.html'
})

export class ACMyAppsListComponent implements OnInit {
  pageTitle: string = 'App List';
  errorMessage: string;

  my_apps: Array<any> = [];

  constructor(private myAppsService: ACMyAppsService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.getMyApps();

  }
  getMyApps() {
    this.myAppsService.list(this.userService.profile.id).subscribe(
      (response: any) => {
        this.my_apps = response.data;
      },
      (error: any) => {
        this.errorMessage = <any>error;
      }
    );
  }

  manage(id: any): void {
    this.router.navigate(['/my-apps', id]);
  }

  add(): void {
    this.router.navigate(['/apps']);
  }
}
