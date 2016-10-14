//@TODO remove ElementRef
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { NameListService } from './name-list/index';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';

import {
  RedirectService,
  ApiBaseService,
  UserService,
  CountryService
}                     from './index';

import {
  HeaderComponent,
  FooterComponent,
  FooterPromotionComponent,
  TablePricingComponent,
  AppCardComponent,
  AppCardPlatformComponent,
  BreadcrumbComponent,
  SliderComponent,
  UploadCropImageComponent
} from '../partials/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ConfirmDialogModule
  ],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    TablePricingComponent,
    AppCardComponent,
    AppCardPlatformComponent,
    BreadcrumbComponent,
    SliderComponent,
    UploadCropImageComponent
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    TablePricingComponent,
    AppCardComponent,
    AppCardPlatformComponent,
    BreadcrumbComponent,
    SliderComponent,
    UploadCropImageComponent,

    ConfirmDialogModule,

    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        NameListService,
        RedirectService,
        ApiBaseService,
        UserService,
        CountryService,
        ConfirmationService
      ]
    };
  }
}
