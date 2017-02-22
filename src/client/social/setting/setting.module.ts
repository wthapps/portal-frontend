import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { SocialSettingsRoutingModule } from './setting-routing.module';
import { ZSocialSettingComponent } from './setting.component';
import { ZSocialSharedModule } from '../shared/shared.module';
import { SharedModule } from '../../core/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpModule,
    SocialSettingsRoutingModule,
    // ZSocialSharedModule,
    SharedModule,
  ],
  declarations: [
    ZSocialSettingComponent
  ]
})
export class SocialSettingsModule {
}
