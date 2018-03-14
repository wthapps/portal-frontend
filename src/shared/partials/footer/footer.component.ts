import { Component, Input } from '@angular/core';
import { Constants } from '../../constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'w-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss'],
})
export class FooterComponent {
  @Input() loggedIn: boolean;
  @Input() template: boolean = false;

  portalDomain: string = Constants.baseUrls.app;
  currentVersion: string = Constants.currentVersion;
}

@Component({
  selector: 'w-footer-promotion',
  templateUrl: 'footer-promotion.component.html'
})
export class FooterPromotionComponent {
}
