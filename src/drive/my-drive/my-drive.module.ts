import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApiBaseService } from '@shared/services';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';
import { LocalStorageModule } from 'angular-2-local-storage';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@shared/shared/components/confirmation/wth-confirm.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { WDataViewModule } from '../shared/components/w-dataView/w-dataView.module';
import { WModalsModule } from '../shared/components/modals/modals.module';

import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { DriveService } from 'drive/shared/services/drive.service';
import { MyDriveComponent } from './my-drive.component';
import { FileUploadService } from '@shared/services/file-upload.service';
import { WDriveBreadcrumbModule } from 'drive/shared/components/breadcrumb/breadcrumb.module';
import { WDriveLeftMenuModule } from 'drive/shared/components/left-menu/left-menu.module';
import { MyDriveRoutingModule } from './my-drive-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    CookieModule.forRoot(),
    FormsModule,
    MyDriveRoutingModule,
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
    WDriveLeftMenuModule,
    InfiniteScrollModule,
    PipeModule
  ],
  declarations: [
    MyDriveComponent,
  ],
  exports: [
    MyDriveComponent,
  ],
  providers: [
    ApiBaseService,
    DatePipe,
    MessageService,
    DriveService
  ]
})
export class MyDriveModule {
}
