import {
  Component
}                          from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                          from '@angular/router';
@Component({
  moduleId: module.id,
  selector: 'account-menu',
  templateUrl: 'account-menu.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})
export class AccountMenuComponent {

  menu = ['menu1','menu2'];

  nhan(xyz){
    this.menu.push(xyz);
  }
}


