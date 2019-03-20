import { WthCommonModule } from './../../shared/common/wth-common.module';
import { NgModule, ModuleWithProviders } from '@angular/core';

import {
  InputSwitchModule,
  CheckboxModule,
  RadioButtonModule,
  AutoCompleteModule,
  CalendarModule,
  PanelMenuModule,
  TooltipModule
} from 'primeng/primeng';

import { ZMediaSharedLeftMenuComponent } from '@media/shared/left-menu/left-menu.component';
// import { MediaUploaderComponent } from './uploader/media-uploader.component';
import { AlbumService } from './service/album.service';
import { MediaUploaderDataService } from './uploader/media-uploader-data.service';

import { AlbumModalModule } from '@shared/components/modal/album/album-modal.module';
import { ZMediaStore } from './store/media.store';
import { ZMediaSharedHeaderComponent } from './header/header.component';
import { TagInputModule } from 'ngx-chips';
import { AlbumDetailInfoComponent } from '../album/album-detail-info.component';
// import { ZMediaAlbumDetailComponent } from '../album/album-detail.component';
import { MediaObjectService } from './container/media-object.service';
import { SharingItemComponent } from './media/sharing-item.component';
import { MediaDetailInfoComponent } from '@media/shared/media/media-detail-info.component';
import { LocationCustomService } from '@media/shared/service/location-custom.service';
import { MediaModalListComponent } from './media-modal-list/media-modal-list.component';

import { HasMoreActionsPipe } from './pipes/has-more-actions.pipe';
import { MediaUploaderV1Component } from './uploader/v1/media-uploader-v1.component';
import { ModalDockModule } from '@shared/shared/components/modal/dock.module';
import { ModalModule } from '@shared/components/modal/modal.module';
import { FileModule } from '@shared/shared/components/file/file.module';
import { PartialModule } from '@shared/partials';
import { WMediaSelectionModule } from '@shared/components/w-media-selection/w-media-selection.module';
import { ComponentsModule } from '@shared/components/components.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MediaModalModule } from '@shared/modules/photo/components/modal/media/media-modal.module';
import { PartialsPhotoSharingModule } from '@shared/modules/photo/components/modal/sharing/sharing.module';
import { PlaylistModalModule } from '@shared/modules/photo/components/modal/playlist/playlist-modal.module';
import { ZMediaTaggingService } from '@shared/modules/photo/components/modal/tagging/tagging.service';
import { SharingService } from '@shared/modules/photo/components/modal/sharing/sharing.service';

TagInputModule.withDefaults({
  tagInput: {
    placeholder: ''
  }
});

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    TagInputModule,
    // WGridListModule,
    AlbumModalModule,
    MediaModalModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WthCommonModule,

    // custom component
    ModalDockModule,
    ModalModule,
    FileModule,
    PartialModule,
    WMediaSelectionModule,
    ComponentsModule,
    // ZSharedMenuModule,
    BoxNoDataModule,
    BoxLoadingModule,
    PipeModule,
    WNavTabModule,
    WObjectListModule,
    MediaModalModule,
    PartialsPhotoSharingModule,
    PlaylistModalModule,

    // third party libs
    TagInputModule,
    InfiniteScrollModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule

    // SharedModule
  ],
  declarations: [
    // MediaUploaderComponent,
    MediaUploaderV1Component,
    ZMediaSharedHeaderComponent,
    AlbumDetailInfoComponent,
    MediaDetailInfoComponent,
    MediaModalListComponent,
    HasMoreActionsPipe,
    // ZMediaAlbumDetailComponent,

    // new components
    SharingItemComponent,
    ZMediaSharedLeftMenuComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WthCommonModule,

    // custom component
    ModalDockModule,
    ModalModule,
    FileModule,
    PartialModule,
    WMediaSelectionModule,
    ComponentsModule,
    // ZSharedMenuModule,
    BoxNoDataModule,
    BoxLoadingModule,
    PipeModule,
    WNavTabModule,
    WObjectListModule,
    MediaModalModule,
    PartialsPhotoSharingModule,
    PlaylistModalModule,

    // third party libs
    TagInputModule,
    InfiniteScrollModule,
    InputSwitchModule,
    CheckboxModule,
    RadioButtonModule,
    AutoCompleteModule,
    CalendarModule,
    PanelMenuModule,
    TooltipModule,

    AlbumModalModule,
    MediaModalModule,
    // MediaUploaderComponent,
    MediaUploaderV1Component,
    MediaModalListComponent,
    ZMediaSharedHeaderComponent,
    AlbumDetailInfoComponent,
    MediaDetailInfoComponent,
    HasMoreActionsPipe,
    // ZMediaAlbumDetailComponent,
    //
    SharingItemComponent,
    ZMediaSharedLeftMenuComponent
  ]
})
export class ZMediaSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ZMediaSharedModule,
      providers: [
        AlbumService,
        ZMediaTaggingService,
        SharingService,
        ZMediaStore,
        LocationCustomService,
        MediaUploaderDataService,
        MediaObjectService
      ]
    };
  }
}
