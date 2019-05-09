import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ApiBaseService } from '@shared/services';
import { WDataViewModule } from '../components/w-dataView/w-dataView.module';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@shared/shared/components/confirmation/wth-confirm.module';
import { ToastModule } from 'primeng/toast';
import { WModalsModule } from '../components/modals/modals.module';
import { WDriveBreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { DriveService } from '../services/drive.service';
import { DriveContainerComponent } from './drive-container.component';
// import { DriveContainerComponent } from './drive-container.component';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    WDataViewModule,
    LocalStorageModule.withConfig({
      prefix: 'my-app',
      storageType: 'localStorage'
    }),
    BoxNoDataModule,
    BoxLoadingModule,
    WthConfirmModule,
    DirectiveModule,
    ToastModule,
    WModalsModule,
    WDriveBreadcrumbModule,
    InfiniteScrollModule,
    PipeModule
  ],
  declarations: [DriveContainerComponent],
  exports: [
    CommonModule,
    BoxNoDataModule,
    BoxLoadingModule,
    WthConfirmModule,
    DirectiveModule,
    ToastModule,
    WModalsModule,

    DriveContainerComponent
  ],
  providers: [ApiBaseService, DatePipe, DriveService]
})
export class DriveContainerModule {}
