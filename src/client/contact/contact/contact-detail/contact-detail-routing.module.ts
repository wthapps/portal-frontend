import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZContactDetailComponent } from './contact-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'contacts/:id', component: ZContactDetailComponent },
      { path: 'contacts/new', component: ZContactDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactDetailRoutingModule {
}
