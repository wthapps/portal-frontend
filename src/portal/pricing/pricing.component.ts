import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../shared/shared/animations/route.animation';

@Component({
  moduleId: module.id,
  selector: 'sd-pricing',
  templateUrl: 'pricing.component.html',
  styleUrls: ['pricing.component.scss'],
  animations: [fadeInAnimation]
})
export class PricingComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
}
