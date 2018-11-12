import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { AddressListComponent } from './address-list.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // third party libraries
    BsModalModule,
    PipeModule,
    
  ],
  declarations: [
    AddressListComponent,
  ],
  exports: [
    AddressListComponent,
  ],
  providers: [

  ]
})

export class AddressModule {
}
