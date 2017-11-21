import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteSettingsComponent } from './settings.component';
import { ZNoteSettingsRoutingModule } from './settings-routing.module';


@NgModule({
  imports: [
    ZNoteSettingsRoutingModule,
    ZNoteSharedModule.forRoot()
  ],
  declarations: [
    ZNoteSettingsComponent
  ],
  exports: [
    ZNoteSettingsComponent
  ],
  providers: []
})

export class ZNoteSettingsModule {
}
