import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ZDriveSharedLeftMenuComponent } from './left-menu.component';
import { RouterModule } from '@angular/router';
import { PanelModule, PanelMenuModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    InfiniteScrollModule,
    PanelModule,
    PanelMenuModule,
    DirectiveModule
  ],
  declarations: [ZDriveSharedLeftMenuComponent],
  exports: [ZDriveSharedLeftMenuComponent]
})
export class WDriveLeftMenuModule {
}
