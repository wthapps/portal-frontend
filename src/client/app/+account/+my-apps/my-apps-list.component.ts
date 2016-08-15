import {
  Component,
  OnInit
}                       from '@angular/core';
import {Router}       from '@angular/router';
import {ApiBaseService, UserService} from '../../shared/index';


@Component({
  moduleId: module.id,
  templateUrl: 'my-apps-list.component.html',
  directives: []
})

export class MyAppsListComponent implements OnInit {
  pageTitle: string = 'App List';

  errorMessage: string;

  my_apps: Array<any> = [];

  constructor(private apiService: ApiBaseService, private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.apiService.get(`users/${this.userService.profile.id}/my-apps`).subscribe(
      (response: any) => {
        this.my_apps = response.data;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  manage(app: any): void {
    this.router.navigate(['/account/dns']);
    console.log('app: ', app);
  }

  add(): void {
    this.router.navigate(['/account/apps']);
  }
}
