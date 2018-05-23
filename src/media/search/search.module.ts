import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';

import { ZMediaSearchRoutingModule } from './search-routing.module';
import { ZMediaSearchComponent } from './search.component';
import { SharedModule } from '@wth/shared/shared.module';
import { CoreModule } from '@wth/core/core.module';
import { WGridListModule } from '@wth/shared/components/grid-list';
import { WToolbarModule } from '@wth/shared/components/toolbar';

@NgModule({
  imports: [
    ZMediaSearchRoutingModule,
    ZMediaSharedModule,
    SharedModule,
    CoreModule,
    WGridListModule,
    WToolbarModule
  ],
  declarations: [ZMediaSearchComponent],
  exports: [ZMediaSearchRoutingModule, ZMediaSharedModule],
  providers: []
})
export class ZMediaSearchModule {}
