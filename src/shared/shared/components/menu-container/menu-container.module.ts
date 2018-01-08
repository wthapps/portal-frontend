import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuContainerComponent } from './menu-container.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MenuContainerComponent
  ],
  exports: [
    MenuContainerComponent
  ],
  providers: [],
  entryComponents: [
    MenuContainerComponent
  ]
})

export class MenuContainerModule {
}
