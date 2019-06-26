import { NgModule } from '@angular/core';

import { ZMediaSharedWithMeRoutingModule } from './shared-with-me-routing.module';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharedWithMeComponent } from './shared-with-me.component';
import { ZMediaSharedWithMeService } from './shared-with-me.service';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';

@NgModule({
  imports: [
    ZMediaSharedWithMeRoutingModule,
    ZMediaSharedModule,
    WGridListModule,
    WToolbarModule
  ],
  declarations: [ZMediaSharedWithMeComponent],
  exports: [ZMediaSharedWithMeComponent],
  providers: [ZMediaSharedWithMeService]
})
export class ZMediaSharedWithMeModule { }
