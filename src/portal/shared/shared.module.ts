import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { PortalSharedFooterComponent, PortalSharedFooterPromotionComponent } from './footer/footer.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { PortalSharedHeaderComponent } from '@portal/shared/header/header.component';


/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    BrowserAnimationsModule,

    CoreModule.forRoot(),
    SharedModule.forRoot()
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
    SharedModule
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
