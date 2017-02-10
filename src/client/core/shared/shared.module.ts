import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import {InputSwitchModule} from 'primeng/primeng';

import { CookieService } from 'angular2-cookie/services/cookies.service';

import { ApiBaseService } from './services/apibase.service';

import { ToolbarComponent } from './toolbar/toolbar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NameListService } from './name-list/name-list.service';
import { PartialsModule } from '../partials/partials.module';
import { UserService } from './services/user.service';
import { TimeFormatPipe } from './pipe/time-format.pipe';
import { SafeHtmlPipe } from './pipe/safeHtml.pipe';
import { StorageService } from './services/storage.service';
import { HandlerService } from './services/handler.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    PartialsModule,
    ConfirmDialogModule,
    InputSwitchModule
  ],
  declarations: [
    ToolbarComponent,
    NavbarComponent,
    // PIPE
    TimeFormatPipe,
    SafeHtmlPipe
  ],
  exports: [
    ToolbarComponent,
    NavbarComponent,
    CommonModule,
    FormsModule,
    RouterModule,
    PartialsModule,
    ConfirmDialogModule,
    InputSwitchModule,
    // PIPE
    TimeFormatPipe,
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
        CookieService,
        StorageService,
        HandlerService
      ]
    };
  }
}
