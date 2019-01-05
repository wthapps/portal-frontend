import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { CommonModule } from '@angular/common';
import { ConfirmComponent, UpdateComponent } from './email';

@NgModule({
  imports: [
    UserRoutingModule,
    CommonModule
  ],
  declarations: [
    ConfirmComponent,
    UpdateComponent,
  ],
  exports: [
    ConfirmComponent,
    UpdateComponent,
  ]
})
export class UserModule {}
