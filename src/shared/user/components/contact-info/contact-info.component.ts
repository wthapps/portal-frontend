import { Component, Input } from '@angular/core';

@Component({
    selector: 'w-user-contact-info',
  templateUrl: 'contact-info.component.html'
})

export class ContactInfoComponent {
  @Input('data') data: any;
  @Input() editable: boolean;
}
