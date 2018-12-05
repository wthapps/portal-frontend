import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageRouting } from './profile-page.routing';
import { ProfileModule } from '@wth/shared/user';
import { ProfilePageComponent } from './profile-page.component';
import { ContactSharedModule } from '@contacts/shared/shared.module';
import { CardModule } from '@contacts/shared/card';
import { WContactSelectionModule } from '@shared/components/w-contact-selection/w-contact-selection.module';
import { AccountService } from '@shared/services';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    ContactSharedModule,
    ProfilePageRouting,

    BoxNoDataModule,
    CardModule,
    WContactSelectionModule,
  ],
  declarations: [
    ProfilePageComponent
  ],
  exports: [
    ProfilePageComponent
  ],
  providers: [
    AccountService
  ]
})
export class ProfilePageModule {}
