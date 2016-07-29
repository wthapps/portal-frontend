import {
  Component, Input
}                       from '@angular/core';
import {Action} from './services.model';

@Component({
  moduleId: module.id,
  selector: 'add-on-item',
  templateUrl: 'addon-item.component.html'
})

export class AddOnItemComponent {
  actions: any = [new Action(2, 'Add', '', true)];
  @Input() item: any;
}
