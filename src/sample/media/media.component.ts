import { Component, ViewEncapsulation, HostBinding } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: 'media.component.html',
  styleUrls: ['media.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SampleMediaComponent {
  @HostBinding('class') class = 'main-page-body';
}
