import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { CheckboxModule } from 'primeng/primeng';
import { HttpClientModule } from '@angular/common/http';
import { CommonEventService } from '@shared/services';
import { DrivePipeModule } from './pipes/pipe.module';
import { WDriveLeftMenuModule } from './components/left-menu/left-menu.module';
import { DriveSharedModalModule } from './modals/shared-modals.module';
import { SubscriptionService } from '@shared/common/subscription/subscription.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, WDriveLeftMenuModule, DrivePipeModule],
  declarations: [],
  exports: [
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BoxNoDataModule,

    //
    CheckboxModule,
    // Directive
    DirectiveModule,

    // Pipe
    DrivePipeModule,

    // Custom
    WDriveLeftMenuModule,
    DriveSharedModalModule
  ]
})
export class DriveSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DriveSharedModule,
      providers: [CommonEventService, SubscriptionService]
    };
  }
}
