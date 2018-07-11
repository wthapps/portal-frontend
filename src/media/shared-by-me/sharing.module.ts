import { NgModule } from '@angular/core';

import { ZMediaSharingRoutingModule } from './sharing-routing.module';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSharingListComponent } from './sharing-list.component';
import { ZMediaSharedByMeService } from './shared-by-me.service';
import { ZMediaSharingDetailComponent } from './sharing-detail.component';
import { SharedModule } from '@wth/shared/shared.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';
import { SharingDetailInfoComponent } from '@media/shared-by-me/sharing-detail-info.component';
import { WUploadModule } from '@shared/components/upload/upload.module';

@NgModule({
  imports: [
    ZMediaSharingRoutingModule,
    ZMediaSharedModule,
    WGridListModule,
    SharedModule,
    WUploadModule,
    WToolbarModule
  ],
  declarations: [
    ZMediaSharingListComponent,
    ZMediaSharingDetailComponent,
    SharingDetailInfoComponent
  ],
  exports: [ZMediaSharingListComponent, SharingDetailInfoComponent],
  providers: [ZMediaSharedByMeService]
})
export class ZMediaSharingModule {}
