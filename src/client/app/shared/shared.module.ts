//@TODO remove ElementRef
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { NameListService } from './name-list/index';

import {
  //2 DialogService,
  //2 ToastsService,
  //2 LoadingService,
  RedirectService,
  ApiBaseService,
  UserService
}                     from './index';

import {
  HeaderComponent,
  FooterComponent,
  FooterPromotionComponent,
  TablePricingComponent
} from '../partials/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    TablePricingComponent
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
    TablePricingComponent,
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
        ApiBaseService,
        UserService,
        RedirectService,
        //2 DialogService,
        //2 ToastsService,
        //2 LoadingService
      ]
    };
  }
}
