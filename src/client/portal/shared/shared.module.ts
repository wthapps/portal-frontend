import { NgModule, ModuleWithProviders } from '@angular/core';

import { CoreSharedModule } from '../../core/shared/shared.module';
import { PortalSharedFooterComponent, PortalSharedFooterPromotionComponent } from './footer/footer.component';
import { PortalSharedHeaderComponent } from './header/header.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CoreSharedModule
  ],
  declarations: [
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent,
    PortalSharedHeaderComponent
  ],
  exports: [
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent,
    PortalSharedHeaderComponent,
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
