import { Component } from '@angular/core';
import { fadeInAnimation } from '../../core/shared/animations/route.animation';

@Component({
  moduleId: module.id,
  selector: 'sd-pricing',
  templateUrl: 'pricing.component.html',
  styleUrls: ['pricing.component.css'],
  host: {
    "[@fadeInAnimation]": 'true'
  },
  animations: [fadeInAnimation]
})

export class PricingComponent {
}
