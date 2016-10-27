import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  templateUrl: 'account.component.html'
  //2 , viewProviders: [
  //   DnsService,
  //   ServicesService
  // ]
})
export class AccountComponent {
  pageTitle: string = 'Account Settings';
}
