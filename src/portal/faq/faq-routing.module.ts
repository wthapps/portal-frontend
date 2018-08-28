import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FaqComponent } from '@portal/faq/faq.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: 'faq', component: FaqComponent }])
  ],
  exports: [RouterModule]
})
export class FaqRoutingModule {}
