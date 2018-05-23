import { Component, OnInit } from '@angular/core';
import { Constants } from "@shared/constant";

@Component({
  selector: 'apps-navigation',
  templateUrl: './apps-navigation.component.html',
  styleUrls: ['./apps-navigation.component.css']
})
export class AppsNavigationComponent implements OnInit {
  tooltip: any = Constants.tooltip;
  urls: any = Constants.baseUrls;

  constructor() {
  }

  ngOnInit() {

  }

}
