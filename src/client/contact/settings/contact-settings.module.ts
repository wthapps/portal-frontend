import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ZContactSettingsComponent } from './contact-settings.component';
import { CoreSharedModule } from '../../core/shared/shared.module';
import { ZContactSettingsRoutingModule } from './contact-settings-routing.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactSettingsRoutingModule,
    CoreSharedModule.forRoot()
  ],
  declarations: [
    ZContactSettingsComponent
  ],
  exports: [
    ZContactSettingsComponent
  ],
  providers: []
})

export class ZContactSettingsModule {
}
