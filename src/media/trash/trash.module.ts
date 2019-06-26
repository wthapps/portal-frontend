import { NgModule } from '@angular/core';

import { CoreModule } from '@wth/core/core.module';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { ZMediaTrashRoutingModule } from '@media/trash/trash-routing.module';
import { ZMediaTrashComponent } from '@media/trash/trash.component';
import { WToolbarModule } from '@shared/components/toolbar';
import { WGridListModule } from '@shared/components/grid-list';
import { ZMediaSharedModule } from './../shared/shared.module';

@NgModule({
  imports: [
    ModalModule,
    ZMediaSharedModule,
    CoreModule,
    WToolbarModule,
    WGridListModule,
    ZMediaTrashRoutingModule
  ],
  declarations: [ZMediaTrashComponent],
  exports: [],
  providers: []
})
export class ZMediaTrashModule {}
