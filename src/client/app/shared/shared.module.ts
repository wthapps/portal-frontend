//@TODO remove ElementRef
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { NameListService } from './name-list/index';

import {
  ConfirmDialogModule,
  ConfirmationService,
  AutoCompleteModule
} from 'primeng/primeng';
import { TagInputModule } from 'ng2-tag-input';

import {
  ApiBaseService,
  UserService,
  CountryService,
  DeactivateConfirmService
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
  UploadCropImageComponent,
  ToTopComponent,
  ReadMoreComponent
} from '../partials/index';

import { LoadingDirective } from './directive/loading.directive';

import { GroupByMonthYearPipe, GroupByPipe, DateUntilNowPipe } from './pipe/index';

import { FormModalComponent } from './form/form-modal.component';
import { ApiBaseServiceV2 } from "./services/apibase.service.v2";
import { NewlinePipe } from './pipe/newline.pipe';
import { TitleCase } from './pipe/titlecase.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ConfirmDialogModule,
    AutoCompleteModule,
    TagInputModule
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
    UploadCropImageComponent,
    ToTopComponent,
    ReadMoreComponent,
    FormModalComponent,
    // Pipe
    GroupByMonthYearPipe,
    GroupByPipe,
    NewlinePipe,
    DateUntilNowPipe,
    TitleCase,
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
    ToTopComponent,
    ReadMoreComponent,

    // third party modules
    ConfirmDialogModule,
    AutoCompleteModule,
    TagInputModule,


    CommonModule,
    FormsModule,
    RouterModule,
    FormModalComponent,
    // Pipe
    GroupByMonthYearPipe,
    GroupByPipe,
    NewlinePipe,
    DateUntilNowPipe,
    TitleCase,
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
        CountryService,
        ConfirmationService,
        DeactivateConfirmService,
        ApiBaseServiceV2,
      ]
    };
  }
}
