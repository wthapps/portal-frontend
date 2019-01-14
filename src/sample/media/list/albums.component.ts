import { Component, HostBinding, ViewChild } from '@angular/core';
import { WDataViewComponent } from '../../shared/w-dataView/w-dataView.component';

@Component({
  selector: 's-media-list',
  templateUrl: 'list.component.html',
  styleUrls: ['list.component.scss']
})
export class MAlbumsComponent {
  @HostBinding('class') class = 'main-page-body';
  @ViewChild('dataView') dataView: WDataViewComponent;
}
