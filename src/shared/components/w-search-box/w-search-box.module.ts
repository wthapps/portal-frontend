import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/primeng';

import { WSearchBoxComponent } from './w-search-box.component';


@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  declarations: [
    WSearchBoxComponent,
  ],
  exports: [
    WSearchBoxComponent,
  ],
  providers: []
})
export class WSearchBoxModule {}
