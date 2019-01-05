import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmComponent, UpdateComponent } from './email';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'users/email/update', component: UpdateComponent },
      { path: 'users/email/confirm', component: ConfirmComponent },
    ])
  ],
  exports: [RouterModule]
})
export class UserRoutingModule {}
