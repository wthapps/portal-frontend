import { Route } from '@angular/router';

import {
  PoliciesComponent,
  TermsComponent,
  CookiesComponent,
  PrivacyComponent
}                           from './index';

export const PoliciesRoutes: Route[] = [
  {
    path: 'policies',
    component: PoliciesComponent,
    children: [
      {path: 'privacy', component: PrivacyComponent},
      {path: 'terms', component: TermsComponent},
      {path: 'cookies', component: CookiesComponent},
      {path: '', component: PrivacyComponent},
      {path: '*', component: PrivacyComponent}
    ]
  }
];
