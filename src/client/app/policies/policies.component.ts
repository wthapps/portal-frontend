import {Component}                from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Routes
}                                 from '@angular/router';
import {PoliciesMenuComponent}    from './menu.component';
import {
  PrivacyComponent,
  TermsComponent,
  CookiesComponent
}                                 from './index';

@Routes([
  {path: '/privacy', component: PrivacyComponent},
  {path: '/terms', component: TermsComponent},
  {path: '/cookies', component: CookiesComponent},
  {path: '/', component: PrivacyComponent},
  {path: '*', component: PrivacyComponent}
])
@Component({
  moduleId: module.id,
  templateUrl: 'policies.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    PoliciesMenuComponent
  ]
})
export class PoliciesComponent {
}
