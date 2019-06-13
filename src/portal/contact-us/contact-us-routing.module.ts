import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactUsComponent } from './contact-us.component';

@NgModule({
  imports: [RouterModule.forChild([{ path: '', component: ContactUsComponent }])],
  exports: [RouterModule]
})
export class ContactUsRoutingModule {}
