import { NgModule } from '@angular/core';

import { WToolbarComponent } from './toolbar.component';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';


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
