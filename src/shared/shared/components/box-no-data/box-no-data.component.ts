import { Component, Input } from '@angular/core';

@Component({
  selector: 'box-no-data',
  templateUrl: 'box-no-data.component.html',
  styleUrls: ['box-no-data.component.scss']
})
export class BoxNoDataComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() subTitle: string = '';
}
