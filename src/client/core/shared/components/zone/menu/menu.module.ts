import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';

import { ZSharedMenuComponent } from './menu.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PanelMenuModule
  ],
  declarations: [
    ZSharedMenuComponent
  ],
  exports: [
    ZSharedMenuComponent
  ],
  providers: []
})

export class ZSharedMenuModule {
}
