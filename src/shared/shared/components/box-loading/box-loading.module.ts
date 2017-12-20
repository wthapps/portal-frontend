import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxLoadingComponent } from './box-loading.component';

@NgModule({
  imports: [
    CommonModule,

  ],
  declarations: [
    BoxLoadingComponent
  ],
  exports: [
    BoxLoadingComponent
  ]
})

export class BoxLoadingModule {
}
