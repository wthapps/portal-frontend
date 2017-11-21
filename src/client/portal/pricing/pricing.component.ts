import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../core/shared/animations/route.animation';

@Component({
  moduleId: module.id,
  selector: 'sd-pricing',
  templateUrl: 'pricing.component.html',
  styleUrls: ['pricing.component.css'],
  animations: [fadeInAnimation]
})

export class PricingComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
}
