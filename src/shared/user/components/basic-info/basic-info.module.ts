import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';

import { BasicInfoComponent } from './basic-info.component';
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
    BasicInfoComponent,
  ],
  exports: [
    BasicInfoComponent,
  ],
  providers: [

  ]
})

export class BasicInfoModule {
}
