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
  panelTitle: string = 'Find Services or Add-ons';
  my_apps: any;

  constructor( 
    private apiService: ApiBaseService, private userService: UserService 
  ) {
  }

  ngOnInit():void {    
    this.apiService.get(`users/${this.userService.profile.id}/my-apps`).subscribe(
      response => {
        this.my_apps = response.data;        
      },
      error => {
        this.errorMessage = <any>error
      }
    );
  }  
  
}
