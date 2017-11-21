import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [
  ],
  exports: [
  ]
})
export class BaseSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BaseSharedModule,
      providers: [
      ]
    };
  }
}
