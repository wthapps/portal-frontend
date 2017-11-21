import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../core/shared/animations/route.animation';

@Component({
  moduleId: module.id,
  selector: 'sd-privacy',
  templateUrl: 'privacy.component.html',
  styleUrls: ['policies.component.css'],
  animations: [fadeInAnimation]
})

export class PrivacyComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
  PanelTitle: string = 'Privacy Policy';
}
