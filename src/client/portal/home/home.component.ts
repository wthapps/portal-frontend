import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../core/shared/config/constants';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent {

  flagsRelease: boolean = Constants.flagsRelease;

  /**
   * Creates an instance of the HomeComponent with the injected
   * NameListService.
   *
   * @param {NameListService} nameListService - The injected NameListService.
   */
  constructor(private router: Router) {
    if (this.flagsRelease) {
      this.router.navigate(['/login']);
    }
  }
}
