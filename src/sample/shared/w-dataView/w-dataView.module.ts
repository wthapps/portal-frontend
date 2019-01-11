import { NgModule } from '@angular/core';
import { WDataViewComponent } from './w-dataView.component';
import { CommonModule } from '@angular/common';
import { DragToSelectModule } from 'ngx-drag-to-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { WDataViewSelectedComponent } from './w-dataView-selected.component';

@NgModule({
  imports: [
    CommonModule,
    InfiniteScrollModule,
    DragToSelectModule.forRoot()
  ],
  declarations: [WDataViewComponent, WDataViewSelectedComponent],
  exports: [WDataViewComponent, WDataViewSelectedComponent]
})
export class WDataViewModule {
}
