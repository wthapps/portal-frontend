import { Component, Input } from '@angular/core';

@Component({
  selector: 'box-loading',
  templateUrl: 'box-loading.component.html',
  styleUrls: ['box-loading.component.scss']
})
export class BoxLoadingComponent {
  @Input() outClass: string = '';
}
