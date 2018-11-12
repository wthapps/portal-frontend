import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';

import { HttpClientModule } from '@angular/common/http';
import { DirectiveModule } from '@wth/shared/shared/directive/directive.module';
import { PipeModule } from '@wth/shared/shared/pipe/pipe.module';
import { LoadingModule } from '@wth/shared/shared/components/loading/loading.module';
import { ToastsModule } from '@wth/shared/shared/components/toast/toast-message.module';
import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AutoCompleteModule } from 'primeng/components/autocomplete/autocomplete';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { BoxLoadingModule } from '@wth/shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@wth/shared/shared/components/confirmation/wth-confirm.module';
//import { Ng2CableModule } from 'ng2-cable';
import { WLeftMenuModule } from '@shared/components/w-left-menu/w-left-menu.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // BrowserModule,
    HttpClientModule,
    //Ng2CableModule,

    CookieModule.forRoot()
  ],
  declarations: [],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    // BrowserModule,
    HttpClientModule,
    LoadingModule,
    ToastsModule,
    ConfirmDialogModule,
    InfiniteScrollModule,
    // InputSwitchModule,
    // CheckboxModule,
    // RadioButtonModule,
    AutoCompleteModule,
    //Ng2CableModule,

    TooltipModule,

    WthConfirmModule,
    BoxLoadingModule,
    WLeftMenuModule,

    // Pipe
    PipeModule,

    // Directive
    DirectiveModule
  ]
})
export class WthCommonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: WthCommonModule,
      providers: []
    };
  }
}
