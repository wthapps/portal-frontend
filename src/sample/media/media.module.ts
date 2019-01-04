import { NgModule } from '@angular/core';
import { SampleMediaComponent } from './media.component';

import { SampleMediaRoutingModule } from './media-routing.module';
import { SliderModule } from 'primeng/slider';
import { SampleSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SliderModule,
    SampleSharedModule,
    SampleMediaRoutingModule
  ],
  declarations: [SampleMediaComponent],
  exports: [SampleMediaComponent]
})
export class SampleMediaModule {
}
