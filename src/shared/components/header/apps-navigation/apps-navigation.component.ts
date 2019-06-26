import { Component, OnInit } from '@angular/core';
import { Constants } from '@shared/constant';

@Component({
  selector: 'apps-navigation',
  templateUrl: './apps-navigation.component.html',
  styleUrls: ['./apps-navigation.component.scss']
})
export class AppsNavigationComponent implements OnInit {
  readonly tooltip: any = Constants.tooltip;
  readonly urls: any = Constants.baseUrls;

  constructor() {
  }

  ngOnInit() {

  }

}
