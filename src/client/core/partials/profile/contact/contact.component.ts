import { Component, Input } from '@angular/core';
import { ProfileConfig } from '../profile-config.model';

@Component({
  moduleId: module.id,
  selector: 'partials-profile-contact',
  templateUrl: 'contact.component.html'
})

export class PartialsProfileContactComponent {
  @Input('data') data: any;
  @Input() config: ProfileConfig;
  @Input() editable: boolean;
}
