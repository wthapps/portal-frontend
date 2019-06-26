import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { CheckboxModule } from 'primeng/primeng';
import { HttpClientModule } from '@angular/common/http';
import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
import { WNoteSelectionModule } from '@shared/components/w-note-selection/w-note-selection.module';
import { SharedServicesModule } from '@shared/shared-services.module';
import { WthCommonModule } from '@shared/common/wth-common.module';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BoxNoDataModule,
    WMediaSelectionModule,
    WNoteSelectionModule,
    WthCommonModule,
    //
    CheckboxModule,
    // Directive
    DirectiveModule
  ]
})
export class SampleSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SampleSharedModule,
      providers: []
    };
  }
}
