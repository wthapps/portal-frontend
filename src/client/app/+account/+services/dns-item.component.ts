import {
  Component, Input
}                       from '@angular/core';
import {Action} from './services.model';

@Component({
  moduleId: module.id,
  selector: 'dns-item',
  templateUrl: 'dns-item.component.html'
})

export class DnsItemComponent {
  actions: any = [new Action(2, 'Add', '', true)];
  @Input() item: any;
}
