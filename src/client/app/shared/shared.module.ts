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
  AutoCompleteModule,
  InputTextareaModule
} from 'primeng/primeng';
import { TagInputModule } from 'ng2-tag-input';

import {
  ApiBaseService,
  UserService,
  CountryService,
  DeactivateConfirmService
} from './index';

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

import { GroupByMonthYearPipe, GroupByPipe, DateUntilNowPipe } from './pipe/index';

import { FormModalComponent } from './form/form-modal.component';
import { ApiBaseServiceV2 } from './services/apibase.service.v2';
import { NewlinePipe } from './pipe/newline.pipe';
import { TitleCase } from './pipe/titlecase.pipe';
import { Ng2Cable, Broadcaster } from 'ng2-cable/js/index';
import { UrlTransformPipe } from './pipe/url.pipe';
import { ShowLengthTransformPipe } from './pipe/show-length.pipe';
import { SearchFormComponent } from '../partials/header/sub/search-form.component';
import { SoSearchService } from '../partials/header/sub/social-search.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    TagInputModule,
    InputTextareaModule

  ],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    HeaderComponent,
    SearchFormComponent,
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
    UrlTransformPipe,
    ShowLengthTransformPipe
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    HeaderComponent,
    SearchFormComponent,
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

    // third party modules
    ConfirmDialogModule,
    AutoCompleteModule,
    TagInputModule,
    InputTextareaModule,


    CommonModule,
    FormsModule,
    RouterModule,

    // Pipe
    GroupByMonthYearPipe,
    GroupByPipe,
    NewlinePipe,
    DateUntilNowPipe,
    TitleCase,
    UrlTransformPipe,
    ShowLengthTransformPipe
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
        Ng2Cable,
        Broadcaster,
        SoSearchService
      ]
    };
  }
}
