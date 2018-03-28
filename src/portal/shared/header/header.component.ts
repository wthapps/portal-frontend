import { Component } from '@angular/core';
import { AuthService } from '@shared/services';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@shared/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'portal-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class PortalSharedHeaderComponent {
  logoUrl: string = Constants.baseUrls.cdn + '/logo/logo.png';
  loggedIn$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.loggedIn$ = this.authService.loggedIn$;
  }
}
