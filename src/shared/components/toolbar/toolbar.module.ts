import { NgModule } from '@angular/core';

import { WToolbarComponent } from './toolbar.component';
import { TooltipModule } from 'primeng/primeng';
import { CommonModule } from '@angular/common';


@NgModule({
  imports: [
    CommonModule,
    TooltipModule
  ],
  declarations: [
    WToolbarComponent
  ],
  exports: [
    WToolbarComponent
  ],
  providers: [],
})
export class WToolbarModule {
}
