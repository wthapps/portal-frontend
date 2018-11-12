import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PortalSharedHeaderComponent } from '@portal/shared/header/header.component';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { PartialModule } from '@wth/shared/partials';
import { NotificationListModule } from '@wth/shared/shared/components/notification-list/notification-list.module';
import { ShowHidePasswordModule } from '@wth/shared/shared/components/show-hide-password/show-hide-password.module';
import { TablePricingModule } from '@wth/shared/shared/components/table-pricing/table-pricing.module';
import { StickyModule } from 'ng2-sticky-kit';
import { AccordionModule } from 'primeng/primeng';

import {
  PortalSharedFooterComponent,
  PortalSharedFooterPromotionComponent
} from './footer/footer.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NotificationListModule,
    ShowHidePasswordModule,
    PartialModule,
    TablePricingModule,
    // Custom modules
    ModalModule,
    WthCommonModule
  ],
  declarations: [
    PortalSharedHeaderComponent,
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent
  ],
  exports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    ShowHidePasswordModule,
    PartialModule,
    AccordionModule,
    StickyModule,

    TablePricingModule,

    // Custom modules
    ModalModule,
    WthCommonModule,

    PortalSharedHeaderComponent,
    PortalSharedFooterComponent,
    PortalSharedFooterPromotionComponent
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
