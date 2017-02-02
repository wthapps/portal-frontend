import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ACMenuComponent } from './menu/menu.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
    ACMenuComponent
  ],
  exports: [
    CommonModule,
    ACMenuComponent
  ]
})
export class ACSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ACSharedModule,
      providers: []
    };
  }
}
