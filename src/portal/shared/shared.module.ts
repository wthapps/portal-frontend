import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { PortalSharedFooterComponent, PortalSharedFooterPromotionComponent } from './footer/footer.component';
import { PortalHeaderComponent } from './header/header.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';


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
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent,
    PortalHeaderComponent
  ],
  exports: [
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent,
    PortalHeaderComponent,
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
