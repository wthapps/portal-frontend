import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'account/confirm_email/:id', component: ConfirmationComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ConfirmationRoutingModule { }
