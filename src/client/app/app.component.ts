import { Component, OnInit } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

import { Config } from './shared/index';
import './operators';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'wth-app',
  templateUrl: 'app.component.html',
})

export class AppComponent implements OnInit {
  constructor(private router: Router) {
    console.log('Environment config', Config);
  }

  /**
   * Issues https://github.com/angular/angular/issues/7791
   * 
   * Changing route doesn't scroll to top in the new page
   */
  ngOnInit() {
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      if (!(navigationEnd instanceof NavigationEnd)) {
        return;
      }
      document.body.scrollTop = 0;
    });
  }
}
