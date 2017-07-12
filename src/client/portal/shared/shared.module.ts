import { NgModule, ModuleWithProviders } from '@angular/core';

import { CoreSharedModule } from '../../core/shared/shared.module';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CoreSharedModule.forRoot()
  ],
  declarations: [
  ],
  exports: [
    CoreSharedModule
  ]
})
export class PortalSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PortalSharedModule,
      providers: []
    };
  }
}
