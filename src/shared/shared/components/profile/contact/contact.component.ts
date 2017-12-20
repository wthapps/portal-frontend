import { Component, Input } from '@angular/core';

@Component({
    selector: 'partials-profile-contact',
  templateUrl: 'contact.component.html'
})

export class PartialsProfileContactComponent {
  @Input('data') data: any;
  @Input() editable: boolean;
}
