import {
  Component, Input
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'display-link',
  templateUrl: 'display-link.component.html',
  styleUrls: ['display-link.component.css'],
})
export class DisplayLinkComponent {
  @Input() data:any;
}
