import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { ShowHidePasswordComponent }   from './show-hide-password.component';

@NgModule({
  imports: [CommonModule, TooltipModule],
  declarations: [ShowHidePasswordComponent],
  exports: [ShowHidePasswordComponent],
  providers: [],
})
export class ShowHidePasswordModule {
}
