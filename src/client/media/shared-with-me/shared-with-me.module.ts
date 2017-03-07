import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharedWithMeService } from './shared-with-me.service';
import { ZMediaPhotoModule } from '../photo/photo.module';
import { ZMediaSharedWithMeRoutingModule } from './shared-with-me-routing.module';

@NgModule({
  imports: [
    ZMediaPhotoModule,
    ZMediaSharedWithMeRoutingModule,
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
