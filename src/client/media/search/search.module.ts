import { NgModule } from '@angular/core';
import { ZMediaSearchRoutingModule } from './search-routing.module';
import { ZMediaSearchComponent } from './search.component';
import { ZMediaSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    ZMediaSearchRoutingModule,
    ZMediaSharedModule
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
