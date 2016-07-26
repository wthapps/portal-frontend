import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';


@Component({
  moduleId: module.id,
  templateUrl: 'add-ons.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AddOnsComponent {
  pageTitle:string = 'Add-ons';
}
