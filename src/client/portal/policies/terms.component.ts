import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../core/shared/animations/route.animation';

@Component({
  moduleId: module.id,
  selector: 'sd-terms',
  templateUrl: 'terms.component.html',
  styleUrls: ['policies.component.css'],
  animations: [fadeInAnimation]
})

export class TermsComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  PanelTitle: string = 'Terms of Service';
}
