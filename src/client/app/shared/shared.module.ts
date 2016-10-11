//@TODO remove ElementRef
import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {ToolbarComponent} from './toolbar/index';
import {NavbarComponent} from './navbar/index';
import {NameListService} from './name-list/index';

import {
  DialogService,
  ToastsService,
  LoadingService,
  RedirectService
}                     from '../shared/index';

import {UserService}  from './services/user.service';

import {
  HeaderComponent,
  FooterComponent,
  FooterPromotionComponent
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
    FooterPromotionComponent
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    HeaderComponent,
    FooterComponent,
    FooterPromotionComponent,
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
        UserService,
        RedirectService,
        //DialogService,
        //ToastsService,
        //LoadingService
      ]
    };
  }
}
