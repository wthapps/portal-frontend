import { ZChatShareUserModule } from './../../user/user.module';
import { NgModule } from '@angular/core';
// import { SharedModule } from '@wth/shared/shared.module';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';
// import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { ChatNoteListModule } from '@shared/components/note-list/chat-module/chat-note-list.module';
import { MessageAssetsComponent } from '@chat/shared/message/assets/message-assets.component';
// import { ZChatShareUserModule } from '@chat/shared/user/user.module';
import { MessageAssetsService } from '@chat/shared/message/assets/message-assets.service';
import { PipeModule } from '@shared/shared/pipe/pipe.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@shared/components/modal/modal.module';
import { BoxNoDataModule } from '@shared/shared/components/box-no-data/box-no-data.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ScrollDirectiveModule } from '@shared/shared/directive/scroll/scroll.directive.module';
import { BoxLoadingModule } from '@shared/shared/components/box-loading/box-loading.module';
import { RouterModule } from '@angular/router';
import { DisplayLinkModule } from '@shared/shared/components/link/display-link.module';
import { WNavTabModule } from '@shared/components/w-nav-tab/w-nav-tab.module';
import { WObjectListModule } from '@shared/components/w-object-list/w-object-list.module';
import { TooltipModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    ModalModule,
    BoxLoadingModule,
    BoxNoDataModule,
    DisplayLinkModule,
    InfiniteScrollModule,
    ScrollDirectiveModule,
    TooltipModule,

    MiniEditorModule,
    ChatNoteListModule,
    PipeModule,
    WNavTabModule,
    WObjectListModule,
    ZChatShareUserModule

    // SharedModule.forRoot(),
    // SharedServicesModule.forRoot(),

    // ZChatShareUserModule
  ],
  declarations: [MessageAssetsComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    ModalModule,
    BoxLoadingModule,
    BoxNoDataModule,
    DisplayLinkModule,
    InfiniteScrollModule,
    ScrollDirectiveModule,
    WNavTabModule,
    WObjectListModule,
    ZChatShareUserModule,

    MessageAssetsComponent

    // ZChatShareUserModule
  ],
  providers: [MessageAssetsService]
})
export class ZChatMessageAssetsModule {}
