import { NgModule } from '@angular/core';
import { SampleMediaComponent } from './media.component';

import { SampleMediaRoutingModule } from './media-routing.module';
import { SliderModule } from 'primeng/slider';
import { SampleSharedModule } from '../shared/shared.module';
import { SampleMediaListComponent } from './list/list.component';
import { WDataViewModule } from '../shared/w-dataView/w-dataView.module';

@NgModule({
  imports: [
    SliderModule,
    SampleSharedModule,
    SampleMediaRoutingModule,
    WDataViewModule
  ],
  declarations: [
    SampleMediaComponent,
    SampleMediaListComponent
  ],
  exports: [
    SampleMediaComponent,
    SampleMediaListComponent
  ]
})
export class SampleMediaModule {
}
