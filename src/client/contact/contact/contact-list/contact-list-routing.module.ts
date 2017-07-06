import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZContactListComponent } from './contact-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: ZContactListComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactListRoutingModule {
}
