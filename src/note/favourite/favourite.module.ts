import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteFavouriteComponent } from './favourite.component';
import { ZNoteFavouriteRoutingModule } from './favourite-routing.module';

@NgModule({
  imports: [ZNoteFavouriteRoutingModule, ZNoteSharedModule],
  declarations: [ZNoteFavouriteComponent],
  exports: [ZNoteFavouriteComponent],
  providers: []
})
export class ZNoteFavouriteModule {}
