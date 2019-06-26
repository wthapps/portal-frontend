import { Component, Input } from '@angular/core';

@Component({
  selector: 'box-loading',
  templateUrl: 'box-loading.component.html',
  styleUrls: ['box-loading.component.scss']
})
export class BoxLoadingComponent {
  @Input() boxClass = '';
  @Input() iconClass = 'fa-4x';
}
