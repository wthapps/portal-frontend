import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZMediaToolbarComponent } from './toolbar/toolbar.component';
import { ZMediaSortbarComponent } from './sortbar/sortbar.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ZMediaToolbarComponent,
    ZMediaSortbarComponent
  ],
  exports: [
    ZMediaToolbarComponent,
    ZMediaSortbarComponent
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: [

      ]
    };
  }
}
