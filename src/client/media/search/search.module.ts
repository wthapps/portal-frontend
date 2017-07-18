import { NgModule } from '@angular/core';

import { ZMediaSharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';

import { ZMediaSearchRoutingModule } from './search-routing.module';
import { ZMediaSearchComponent } from './search.component';

@NgModule({
  imports: [
    ZMediaSearchRoutingModule,
    ZMediaSharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [ZMediaSearchComponent],
  exports: [
    ZMediaSearchRoutingModule,
    ZMediaSharedModule
  ],
  providers: []
})

export class ZMediaSearchModule {
}
