import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfirmComponent, UpdateComponent } from './email';
import { UserAlertComponent } from './alert/user-alert.component';
import { ConfirmationComponent } from './email/confirmation.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'email/update',
        component: UpdateComponent,
      },
      {
        path: 'email/confirm',
        component: ConfirmationComponent,
        canActivate: null
      },
      {
        path: 'alert',
        component: UserAlertComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class UserRoutingModule {}
