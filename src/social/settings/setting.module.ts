import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ZSocialSettingComponent } from './setting.component';
import { SharedModule } from '@wth/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, FormsModule, HttpClientModule, SharedModule],
  declarations: [ZSocialSettingComponent]
})
export class SocialSettingsModule {}
