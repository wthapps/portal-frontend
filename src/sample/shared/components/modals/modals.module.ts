import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiBaseService } from '@shared/services';
import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';

import { WModalsAddToAlbumComponent } from './add-to-album/add-to-album.component';
import { WModalsShareComponent } from './share/share.component';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WModalsShareService } from './share/share.service';
import { WModalsPhotoEditInfoComponent } from './photo-edit-info/photo-edit-info.component';
import { CreateAlbumComponent } from './create-album/create-album.component';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
    AutoCompleteModule,
    CalendarModule,
    DirectiveModule,
    InfiniteScrollModule,
    BoxNoDataModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    WModalsAddToAlbumComponent,
    WModalsShareComponent,
    WModalsPhotoEditInfoComponent,
    CreateAlbumComponent
  ],
  exports: [
    WModalsAddToAlbumComponent,
    WModalsShareComponent,
    WModalsPhotoEditInfoComponent
  ],
  providers: [ApiBaseService, WModalsShareService]
})
export class WModalsModule {
}
