import {Component} from '@angular/core';
import {
  WthJoinUsComponent,
  FooterPromotionComponent
} from '../shared/index';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  directives: [
    WthJoinUsComponent,
    FooterPromotionComponent
  ],
  styleUrls: ['about.component.css']
})

export class AboutComponent {
}
