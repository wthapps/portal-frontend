import { NgModule } from '@angular/core';
import { SampleMediaComponent } from './media.component';

import { SampleMediaRoutingModule } from './media-routing.module';
import { SliderModule } from 'primeng/slider';
import { SampleMediaListComponent } from './list/list.component';
import { WDataViewModule } from '../shared/w-dataView/w-dataView.module';
import { CommonModule } from '@angular/common';
import { SampleMediaService } from './shared/media.service';
import { ApiBaseService } from '@shared/services';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CookieModule.forRoot(),
    SliderModule,
    FormsModule,
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
  ],
  providers: [
    ApiBaseService,
    SampleMediaService
  ]
})
export class SampleMediaModule {
}
