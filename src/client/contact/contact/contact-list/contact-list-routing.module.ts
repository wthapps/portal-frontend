import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZContactListComponent } from './contact-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      // { path: 'contact/:id', component: ZContactListComponent },
      { path: 'contacts', component: ZContactListComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactListRoutingModule {
}
