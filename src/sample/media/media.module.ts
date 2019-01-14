import { NgModule } from '@angular/core';
import { MediaComponent } from './media.component';

import { MediaRoutingModule } from './media-routing.module';
import { WDataViewModule } from '../shared/w-dataView/w-dataView.module';
import { CommonModule, DatePipe } from '@angular/common';
import { ApiBaseService } from '@shared/services';
import { CookieModule } from 'ngx-cookie';
import { FormsModule } from '@angular/forms';
import { MPhotosComponent } from './list/photos.component';
import { MPhotosService } from './shared/services/photos.service';
import { MMediaService } from './shared/media.service';
import { LocalStorageModule } from 'angular-2-local-storage';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WthConfirmModule } from '@shared/shared/components/confirmation/wth-confirm.module';

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
    WthConfirmModule
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
    DatePipe,
  ]
})
export class MediaModule {
}
