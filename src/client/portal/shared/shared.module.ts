import { NgModule, ModuleWithProviders } from '@angular/core';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { PortalSharedHeaderComponent } from './header/header.component';
import { PortalSharedFooterComponent, PortalSharedFooterPromotionComponent } from './footer/footer.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CoreSharedModule.forRoot()
  ],
  declarations: [
    PortalSharedHeaderComponent,
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent,
  ],
  exports: [
    PortalSharedHeaderComponent,
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent,
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
