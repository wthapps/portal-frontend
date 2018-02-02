import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SliderModule } from 'primeng/primeng';
import { GridListHeaderComponent } from '@wth/shared/components';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    SliderModule
  ],
  declarations: [GridListHeaderComponent],
  exports: [GridListHeaderComponent],
  providers: [],
})
export class GridListModule {
}
