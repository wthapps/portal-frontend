import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'efax.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AccountServicesEFaxComponent {
  pageTitle:string = 'eFax Service';
}
