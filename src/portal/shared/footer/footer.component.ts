import { Component } from '@angular/core';
import { Constants } from '@wth/shared/constant';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'portal-shared-footer',
  templateUrl: 'footer.component.html',
  styleUrls: ['footer.component.scss'],
})
export class PortalSharedFooterComponent {
  currentVersion: string = Constants.currentVersion;
}

@Component({
  moduleId: module.id,
  selector: 'portal-shared-footer-promotion',
  templateUrl: 'footer-promotion.component.html'
})
export class PortalSharedFooterPromotionComponent {
}
