import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PanelMenuModule } from 'primeng/components/panelmenu/panelmenu';

import { ZSharedMenuComponent } from './menu.component';
import { PipeModule } from "@shared/shared/pipe/pipe.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PipeModule,
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
