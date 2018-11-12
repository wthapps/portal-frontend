import { Component } from '@angular/core';
import { Constants } from '@shared/constant';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent {
  urls: any = Constants.baseUrls;

}
