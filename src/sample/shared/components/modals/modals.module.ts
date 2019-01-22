import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiBaseService } from '@shared/services';
import { BsModalModule } from 'ng2-bs3-modal';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { WModalsAddToAlbumComponent } from './add-to-album/add-to-album.component';
import { WModalsShareComponent } from './share/share.component';
import { DirectiveModule } from '@shared/shared/directive/directive.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { FormsModule } from '@angular/forms';
import { WModalsShareService } from './share/share.service';

@NgModule({
  imports: [
    CommonModule,
    BsModalModule,
    AutoCompleteModule,
    DirectiveModule,
    InfiniteScrollModule,
    BoxNoDataModule,
    FormsModule
  ],
  declarations: [
    WModalsAddToAlbumComponent,
    WModalsShareComponent
  ],
  exports: [
    WModalsAddToAlbumComponent,
    WModalsShareComponent
  ],
  providers: [ApiBaseService, WModalsShareService]
})
export class WModalsModule {
}
