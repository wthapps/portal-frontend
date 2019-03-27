import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePageRouting } from './profile-page.routing';
import { ProfileModule } from '@wth/shared/user';
import { ProfilePageComponent } from './profile-page.component';
import { ContactSharedModule } from '@contacts/shared/shared.module';
import { CardModule } from '@contacts/shared/card';
import { AccountService } from '@shared/services';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { ShareEditorModule } from '@shared/components/editors/share';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { UserCardModule } from '@shared/user/card';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    ContactSharedModule,
    ProfilePageRouting,

    BoxNoDataModule,
    BoxLoadingModule,
    CardModule,
    UserCardModule,
    ShareEditorModule
  ],
  declarations: [ProfilePageComponent],
  exports: [ProfilePageComponent],
  providers: [AccountService]
})
export class ProfilePageModule {}
