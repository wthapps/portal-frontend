import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { PhoneListComponent } from './phone-list.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { AutoCompleteModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // third party libraries
    BsModalModule,
    AutoCompleteModule,
    PipeModule,
  ],
  declarations: [
    PhoneListComponent,
  ],
  exports: [
    PhoneListComponent,
  ],
  providers: [

  ]
})

export class PhoneModule {
}
