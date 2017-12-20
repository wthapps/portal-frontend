import { Component } from '@angular/core';
import { Constants } from '../../../shared/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'wth-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss'],
})
export class FooterComponent {
  portalDomain: string = Constants.baseUrls.app;

}

@Component({
  selector: 'wth-footer-promotion',
  templateUrl: 'footer-promotion.component.html'
})
export class FooterPromotionComponent {
}
