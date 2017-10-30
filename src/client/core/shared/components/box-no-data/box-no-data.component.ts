import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'box-no-data',
  templateUrl: 'box-no-data.component.html',
  styleUrls: ['box-no-data.component.css']
})
export class BoxNoDataComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() subTitle: string = '';
}
