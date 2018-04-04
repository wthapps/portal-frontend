import { NgModule, ModuleWithProviders } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  PortalSharedFooterComponent,
  PortalSharedFooterPromotionComponent
} from './footer/footer.component';
import { PortalSharedHeaderComponent } from '@portal/shared/header/header.component';
import { NotificationListModule } from '@wth/shared/shared/components/notification-list/notification-list.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ShowHidePasswordModule } from '@wth/shared/shared/components/show-hide-password/show-hide-password.module';
import { ModalModule } from '@wth/shared/modals/modals.module';
import { TablePricingModule } from '@wth/shared/shared/components/table-pricing/table-pricing.module';
import { FooterModule } from '@wth/shared/partials/footer/footer.module';
import { PartialModule } from '@wth/shared/partials';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';

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
