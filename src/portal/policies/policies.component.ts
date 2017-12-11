import { Component, HostBinding } from '@angular/core';
import { fadeInAnimation } from '../../shared/shared/animations/route.animation';

@Component({
  moduleId: module.id,
  selector: 'sd-policies',
  templateUrl: 'policies.component.html',
  animations: [fadeInAnimation]
})

export class PoliciesComponent {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
}
