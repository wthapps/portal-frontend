import {
  Component,
  OnInit
}                          from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                          from '@angular/router';
import { ServicesService } from '../+services/services.service';


@Component({
  moduleId: module.id,
  selector: 'installed-apps',
  templateUrl: 'installed-apps.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [ServicesService]
})

export class InstalledAppsComponent implements OnInit {
  has_installed_apps: boolean = false;
  installed_apps: any = [];

  constructor ( private appsService: ServicesService) {

  }

  ngOnInit(): void {
    // load installed apps list
    this.appsService.getUserProducts().subscribe(
      response => {
        this.has_installed_apps = response.length > 0 ? true : false;
        this.installed_apps = response;
      },
      error => {
        console.log(error);
      }
    );
  }
}


