import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { CoverInfoComponent } from './cover-info.component';
import { PartialsFormModule } from '@shared/shared/components/form/partials-form.module';
import { WModalService } from '../../../modal/w-modal-service';
import { NameEditModalComponent } from '@shared/user/components/cover-info/name-edit-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // third party libraries
    BsModalModule,
    PartialsFormModule,
  ],
  declarations: [
    CoverInfoComponent,
    NameEditModalComponent,
  ],
  exports: [
    CoverInfoComponent,
  ],
  providers: [
    WModalService
  ],
  entryComponents: [
  ]
})

export class CoverInfoModule {
}
