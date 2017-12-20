import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../shared/shared/animations/route.animation';

@Component({
  moduleId: module.id,
  selector: 'sd-terms',
  templateUrl: 'terms.component.html',
  styleUrls: ['policies.component.scss'],
  animations: [fadeInAnimation]
})

export class TermsComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;

  PanelTitle: string = 'Terms of Service';
}
