import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ZSocialSettingComponent } from './setting.component';
// import { SharedModule } from '@wth/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ZSocialSharedModule } from '@social/shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule,
    ZSocialSharedModule
    // , SharedModule
  ],
  declarations: [ZSocialSettingComponent]
})
export class SocialSettingsModule {}
