import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { ApiBaseService } from '@shared/services';
import { WDataViewModule } from '../components/w-dataView/w-dataView.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WModalsModule } from '../components/modals/modals.module';
import { WDriveBreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { DriveContainerComponent } from './drive-container.component';
import { FileSizePipe } from '@shared/shared/pipe/file-size.pipe';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    WDataViewModule,
    BoxNoDataModule,
    BoxLoadingModule,
    DirectiveModule,
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
    DirectiveModule,
    WModalsModule,

    DriveContainerComponent
  ],
  providers: [ApiBaseService, DatePipe]
})
export class DriveContainerModule {}
