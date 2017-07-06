import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZContactDetailComponent } from './contact-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'detail/:id', component: ZContactDetailComponent },
      { path: 'new', component: ZContactDetailComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactDetailRoutingModule {
}
