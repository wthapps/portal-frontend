import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageRouting } from './profile-page.routing';
import { ProfileModule } from '@wth/shared/user';
import { ProfilePageComponent } from './profile-page.component';
import { ContactSharedModule } from '@contacts/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    ContactSharedModule,
    ProfilePageRouting
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
