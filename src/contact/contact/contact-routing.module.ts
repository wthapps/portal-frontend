import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZContactListComponent } from './contact-list/contact-list.component';
import { ZContactEditPageComponent } from './contact-edit/contact-edit-page.component';
import { ZContactDetailComponent } from './contact-detail/contact-detail.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'contacts', component: ZContactListComponent, canActivate: [AuthGuard], children: [
        { path: ':id', component: ZContactEditPageComponent },
        { path: 'new', component: ZContactEditPageComponent },
        { path: 'detail/:id', component: ZContactDetailComponent }
      ] }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactRoutingModule {
}
