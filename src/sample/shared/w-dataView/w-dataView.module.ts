import { NgModule } from '@angular/core';
import { WDataViewComponent } from './w-dataView.component';
import { CommonModule } from '@angular/common';
import { DragToSelectModule } from 'ngx-drag-to-select';

@NgModule({
  imports: [
    CommonModule,
    DragToSelectModule.forRoot()
  ],
  declarations: [WDataViewComponent],
  exports: [WDataViewComponent]
})
export class WDataViewModule {
}
