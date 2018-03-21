import { NgModule } from '@angular/core';
import { BaseHomeRoutingModule } from './home-routing.module';
import { ZNoteSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [BaseHomeRoutingModule, ZNoteSharedModule],
  declarations: [],
  exports: [],
  providers: []
})
export class ZNoteHomeModule {}
