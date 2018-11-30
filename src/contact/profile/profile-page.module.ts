import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageRouting } from './profile-page.routing';
import { ProfileModule } from '@wth/shared/user';
import { ProfilePageComponent } from './profile-page.component';
import { ContactSharedModule } from '@contacts/shared/shared.module';
import { CardModule } from '@contacts/shared/card';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    ContactSharedModule,
    ProfilePageRouting,
    CardModule,
  ],
  declarations: [
    ProfilePageComponent
  ],
  exports: [
    ProfilePageComponent
  ],
  providers: []
})
export class ProfilePageModule {}
