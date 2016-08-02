import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

/**
 * This class represents the footer component.
 */
@Component({
  moduleId: module.id,
  selector: 'app-card-sm',
  template: `
    <div class="app-card-sm">
      <div class="app-card-cover">
        <figure>
          <img src="assets/images/apps/icon-md.png" alt="">
        </figure>
      </div>
      <div class="app-card-content">
        <p class="name">Featured New App & Service No 01</p>
        <p class="cat">Product Category</p>
        <ul class="flatform">
          <li>
            <i class="fa fa-windows"></i>
          </li>
          <li>
            <i class="fa fa-apple"></i>
          </li>
          <li>
            <i class="fa fa-desktop"></i>
          </li>
        </ul>
      </div>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class AppCardSmComponent {

}
