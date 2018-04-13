import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './contact-settings.component';
import { ZContactSettingsRoutingModule } from './contact-settings-routing.module';

import { AutoCompleteModule, RadioButtonModule } from 'primeng/primeng';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactSettingsRoutingModule,
    RadioButtonModule,
    AutoCompleteModule,
    // CoreModule,
    WthCommonModule
  ],
  declarations: [SettingsComponent],
  exports: [SettingsComponent],
  providers: []
})
export class SettingsModule { }
