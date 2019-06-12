import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { CommonModule } from '@angular/common';
import { ConfirmationComponent, ConfirmComponent, UpdateComponent } from './email';
import { RegistrationService } from './registration/registration.service';
import { UserAlertComponent } from './alert/user-alert.component';

@NgModule({
  imports: [
    UserRoutingModule,
    CommonModule
  ],
  declarations: [
    ConfirmComponent,
    UpdateComponent,
    ConfirmationComponent,
    UserAlertComponent
  ],
  exports: [
    ConfirmComponent,
    UpdateComponent,
    ConfirmationComponent,
    UserAlertComponent
  ],
  providers: [
    RegistrationService
  ]
})
export class UserModule {}
