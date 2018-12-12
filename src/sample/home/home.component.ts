import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../../shared/constant/config/constants';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent {
  tooltip: any = Constants.tooltip;

  constructor(
    private router: Router
  ) {
  }
}
