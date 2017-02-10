import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ApiBaseService } from './services/apibase.service';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NameListService } from './name-list/name-list.service';
import { PartialsModule } from '../partials/partials.module';
import { UserService } from './services/user.service';


import { GroupByMonthYearPipe } from './pipe/groupby-month-year.pipe';
import { GroupByPipe } from './pipe/groupby.pipe';
import { NewlinePipe } from './pipe/newline.pipe';
import { TimeFormatPipe } from './pipe/time-format.pipe';
import { TitleCase } from './pipe/titlecase.pipe';
import { UrlTransformPipe } from './pipe/url.pipe';
import { ShowLengthTransformPipe } from './pipe/show-length.pipe';
import { SafeHtmlPipe } from './pipe/safeHtml.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsModule,
    ConfirmDialogModule,
    Ng2Bs3ModalModule
  ],
  declarations: [
    ToolbarComponent,
    NavbarComponent,

    // Pipe
    GroupByMonthYearPipe,
    GroupByPipe,
    NewlinePipe,
    TimeFormatPipe,
    TitleCase,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    SafeHtmlPipe
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PartialsModule,
    ConfirmDialogModule,
    Ng2Bs3ModalModule,

    // Component
    ToolbarComponent,
    NavbarComponent,

    // Pipe
    GroupByMonthYearPipe,
    GroupByPipe,
    NewlinePipe,
    TimeFormatPipe,
    TitleCase,
    UrlTransformPipe,
    ShowLengthTransformPipe,
    SafeHtmlPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        ApiBaseService,
        UserService,
        NameListService,
        ConfirmationService,
        CookieService
      ]
    };
  }
}
