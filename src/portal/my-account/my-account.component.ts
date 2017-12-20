import { Component, OnInit } from '@angular/core';
import { Constants } from '../../shared/constant/config/constants';

/**
 * This class represents the lazy loaded MyAccountComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-my-account',
  template: `redirecting...`
})
export class MyAccountComponent implements OnInit {
  ngOnInit() {
    window.location.href = Constants.baseUrls.myAccount;
  }
}
