import { NgModule } from '@angular/core';

import { ZNoteSharedModule } from '../shared/shared.module';
import { ZNoteDetailRoutingModule } from './detail-routing.module';
import { ZNoteDetailEditComponent } from './edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectiveModule } from '@shared/shared/directive/directive.module';

@NgModule({
  imports: [
    ZNoteDetailRoutingModule,
    ZNoteSharedModule,
    FormsModule,
    ReactiveFormsModule,
    DirectiveModule
  ],
  declarations: [ZNoteDetailEditComponent],
  exports: [ZNoteDetailEditComponent],
  providers: []
})
export class ZNoteDetailModule {
}
