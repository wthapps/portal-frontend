import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ZContactUserDetailComponent } from '@contacts/contact/user-detail/contact-user-detail.component';
import { ContactSearchComponent } from '@contacts/search/search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: ContactSearchComponent
          },
          {
            path: ':id',
            component: ContactSearchComponent
          }
        ]
      },
    ])
  ],
  exports: [RouterModule]
})
export class ZContactSearchRoutingModule { }
