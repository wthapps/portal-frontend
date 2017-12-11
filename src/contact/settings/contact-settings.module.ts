import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './contact-settings.component';
import { ZContactSettingsRoutingModule } from './contact-settings-routing.module';

import { SharedModule } from '@shared/shared.module';
import { AutoCompleteModule, RadioButtonModule } from 'primeng/primeng';

@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactSettingsRoutingModule,
    RadioButtonModule,
    AutoCompleteModule,
    // CoreModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    SettingsComponent
  ],
  exports: [
    SettingsComponent
  ],
  providers: []
})

export class SettingsModule {
}
