import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharedWithMeService } from './shared-with-me.service';

@NgModule({
  imports: [
    ZMediaSharedModule.forRoot()
  ],
  declarations: [
    ZMediaSharedWithMeComponent
  ],
  exports: [
    ZMediaSharedWithMeComponent
  ],
  providers: [
    ZMediaSharedWithMeService
  ]
})

export class ZMediaSharedWithMeModule {
}
