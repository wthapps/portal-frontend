import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ZSharedMenuComponent } from './menu/menu.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ZSharedMenuComponent
  ],
  exports: [
    CommonModule,
    ZSharedMenuComponent
  ]
})
export class ZSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZSharedModule,
      providers: []
    };
  }
}
