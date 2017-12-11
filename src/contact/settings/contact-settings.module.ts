import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ZContactSettingsComponent } from './contact-settings.component';
import { ZContactSettingsRoutingModule } from './contact-settings-routing.module';

// import { CoreModule } from '../../core/core.module';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  imports: [
    ReactiveFormsModule,
    ZContactSettingsRoutingModule,
    // CoreModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    ZContactSettingsComponent
  ],
  exports: [
    ZContactSettingsComponent
  ],
  providers: []
})

export class SettingsModule {
}
