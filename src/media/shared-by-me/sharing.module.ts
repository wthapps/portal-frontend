import { NgModule } from '@angular/core';

import { ZMediaSharingRoutingModule } from './sharing-routing.module';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharingListComponent } from './sharing-list.component';
import { ZMediaSharedByMeService } from './shared-by-me.service';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';
import { SharedModule } from '@wth/shared/shared.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';

@NgModule({
  imports: [
    ZMediaSharingRoutingModule,
    ZMediaSharedModule,
    WGridListModule,
    SharedModule,
    WToolbarModule
  ],
  declarations: [
    ZMediaSharingListComponent,
    ZMediaSharingDetailComponent
  ],
  exports: [ZMediaSharingListComponent],
  providers: [ZMediaSharedByMeService]
})
export class ZMediaSharingModule {}
