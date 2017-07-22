import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZContactListComponent } from './contact-list/contact-list.component';
import { ContactEditPageComponent } from './contact-edit/contact-edit-page.component';
import { ZContactDetailComponent } from './contact-detail/contact-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'contacts', component: ZContactListComponent },
      { path: 'contacts/:id', component: ContactEditPageComponent },
      { path: 'contacts/new', component: ContactEditPageComponent },
      { path: 'contacts/detail/:id', component: ZContactDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ContactRoutingModule {
}
