import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutoCompleteModule } from 'primeng/primeng';

import { ZSharedAutoCompleteService } from './auto-complete.service';
import { ZSharedAutoCompleteComponent } from './auto-complete.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [
    ZSharedAutoCompleteComponent
  ],
  exports: [
    ZSharedAutoCompleteComponent
  ],
  providers: [
    ZSharedAutoCompleteService
  ]
})

export class ZSharedAutoCompleteModule {
}
