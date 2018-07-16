import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZContactListComponent } from './contact-list/contact-list.component';
import { ZContactEditPageComponent } from './contact-edit/contact-edit-page.component';
import { ZContactDetailComponent } from './contact-detail/contact-detail.component';
import { AuthGuard } from '@wth/shared/services';
import { ZContactUserDetailComponent } from '@contacts/contact/user-detail/contact-user-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'contacts',
        component: ZContactListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts',
        component: ZContactListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'others',
        component: ZContactListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts/:id/:mode',
        component: ZContactEditPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts/:id',
        component: ZContactEditPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts/new',
        component: ZContactEditPageComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts/:group',
        component: ZContactListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts/detail/:id',
        component: ZContactDetailComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'contacts/user_detail/:id',
        component: ZContactUserDetailComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactRoutingModule {}
