import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteMySharingComponent } from './my-sharing.component';
import { ZNoteMySharingRoutingModule } from './my-sharing-routing.module';


@NgModule({
  imports: [
    ZNoteMySharingRoutingModule,
    ZNoteSharedModule.forRoot()
  ],
  declarations: [
    ZNoteMySharingComponent
  ],
  exports: [
    ZNoteMySharingComponent
  ],
  providers: []
})

export class ZNoteMySharingModule {
}
