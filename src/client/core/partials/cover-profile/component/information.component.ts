/**
 * Created by anvo on 08/05/2017.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'information',
  template: `
    <ng-content></ng-content>
    `
})
export class InformationComponent {
  @Input() item: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();


}
