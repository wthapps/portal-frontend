import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { EmailListComponent } from './email-list.component';
import { PipeModule } from '@shared/shared/pipe/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // third party libraries
    BsModalModule,
    PipeModule
    
  ],
  declarations: [
    EmailListComponent,
  ],
  exports: [
    EmailListComponent,
  ],
  providers: [

  ]
})

export class EmailModule {
}
