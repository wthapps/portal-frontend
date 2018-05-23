import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrivacyComponent } from './privacy.component';
import { TermsComponent } from './terms.component';
import { PoliciesComponent } from './policies.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'policies',
        component: PoliciesComponent,
        children: [
          { path: 'privacy', component: PrivacyComponent },
          { path: 'terms', component: TermsComponent },
          { path: '', component: PrivacyComponent },
          { path: '*', component: PrivacyComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class PoliciesRoutingModule {}
