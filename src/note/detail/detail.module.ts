import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteDetailRoutingModule } from './detail-routing.module';
import { ZNoteDetailEditComponent } from './edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    ZNoteDetailRoutingModule,
    ZNoteSharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ZNoteDetailEditComponent
  ],
  exports: [
    ZNoteDetailEditComponent
  ],
  providers: []
})

export class ZNoteDetailModule {
}
