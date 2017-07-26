import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ZSharedMenuComponent } from './menu.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
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
