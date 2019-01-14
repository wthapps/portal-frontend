import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DragToSelectModule } from 'ngx-drag-to-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SliderModule } from 'primeng/slider';

import { WDataViewComponent } from './w-dataView.component';
import { WDataViewSelectedComponent } from './w-dataView-selected.component';
import { WDataViewNavComponent } from './w-dataView-nav.component';
import { DirectiveModule } from '@shared/shared/directive/directive.module';

@NgModule({
  imports: [
    CommonModule,
    SliderModule,
    FormsModule,
    InfiniteScrollModule,
    DragToSelectModule.forRoot(),
    DirectiveModule
  ],
  declarations: [WDataViewComponent, WDataViewSelectedComponent, WDataViewNavComponent],
  exports: [WDataViewComponent, WDataViewSelectedComponent, WDataViewNavComponent]
})
export class WDataViewModule {
}
