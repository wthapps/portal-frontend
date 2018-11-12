import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WNavTabComponent } from './w-nav-tab.component';
import { TooltipModule } from 'primeng/primeng';

@NgModule({
  imports: [CommonModule, TooltipModule],
  declarations: [WNavTabComponent],
  exports: [WNavTabComponent],
  providers: [],
})
export class WNavTabModule {
}
