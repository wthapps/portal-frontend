import { NgModule } from '@angular/core';
import { MediaComponent } from './media.component';

import { CommonModule, DatePipe } from '@angular/common';
import { ApiBaseService } from '@shared/services';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';
import { BsModalModule } from 'ng2-bs3-modal';
import { LocalStorageModule } from 'angular-2-local-storage';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@shared/shared/components/confirmation/wth-confirm.module';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { MAlbumsService } from './shared/services/albums.service';

import { MediaRoutingModule } from './media-routing.module';
import { MSharedAddToAlbumComponent } from './shared/components/add-to-album/add-to-album.component';
import { MPhotosComponent } from './list/photos.component';
import { WDataViewModule } from '../shared/w-dataView/w-dataView.module';

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
    BsModalModule,
    DirectiveModule,
    InfiniteScrollModule,
    ToastModule
  ],
  declarations: [
    MediaComponent,
    MPhotosComponent,
    MSharedAddToAlbumComponent
  ],
  exports: [
    MediaComponent,
    MPhotosComponent,
    MSharedAddToAlbumComponent
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
