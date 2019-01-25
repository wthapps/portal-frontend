import { NgModule } from '@angular/core';
import { MediaComponent } from './media.component';

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
import { MAlbumsService } from './shared/services/albums.service';

import { MediaRoutingModule } from './media-routing.module';
import { MPhotosComponent } from './list/photos.component';

import { MPhotosService } from './shared/services/photos.service';
import { MMediaService } from './shared/media.service';

@NgModule({
  imports: [
    CommonModule,
    CookieModule.forRoot(),
    FormsModule,
    MediaRoutingModule,
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
    WModalsModule
  ],
  declarations: [
    MediaComponent,
    MPhotosComponent
  ],
  exports: [
    MediaComponent,
    MPhotosComponent
  ],
  providers: [
    ApiBaseService,
    MMediaService,
    MPhotosService,
    MAlbumsService,
    DatePipe,
    MessageService
  ]
})
export class MediaModule {
}
