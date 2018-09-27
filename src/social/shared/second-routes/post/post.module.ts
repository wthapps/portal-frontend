import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { InputSwitchModule } from 'primeng/primeng';
import { TagInputModule } from 'ngx-chips';

import { CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
import { Ng2HdModule } from '@wth/shared/shared/ng2-hd';
import { PostEditComponent } from './post-edit.component';
import { PostActivitiesComponent } from './post-activities.component';
import { PostLikeDislikeComponent } from './post-likedislike.component';
import { PostService } from './shared/post.service';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';
import { PostListComponent } from '@social/shared/second-routes/post/post-list.component';
import { PostHeaderComponent, PostBodyComponent, PostFooterComponent } from '@social/shared/second-routes/post/components';
import { PostComponent } from '@social/shared/second-routes/post/post.component';
import { PostDetailComponent } from '@social/shared/second-routes/post/post-detail.component';
import { WTHEmojiModule } from '@shared/components/emoji/emoji.module';
import { ReadMoreModule } from '@shared/shared/components/read-more/read-more.module';
import { DisplayLinkModule } from '@shared/shared/components/link/display-link.module';
import { EntitySelectModule } from '@shared/shared/components/entity-select/entity-select.module';
import { PartialsPhotoModule } from '@shared/shared/components/photo/photo.module';
import { ZSocialSharedModule } from './../../shared.module';
import { WMediaPreviewV1Module } from '@shared/components/w-media-preview/media-preview-v1.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MiniEditorModule,
    Ng2HdModule,
    WTHEmojiModule,
    ReadMoreModule,
    EntitySelectModule,
    PartialsPhotoModule,
    DisplayLinkModule,
    ZSocialSharedModule,
    TagInputModule,
    InputSwitchModule,
    WMediaPreviewV1Module


  ],
  declarations: [
    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,

    PostEditComponent,
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    // MemberListInviteComponent,
    // Comments
    CommentItemEditorComponent

  ],
  entryComponents: [PostLikeDislikeComponent, PostActivitiesComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MiniEditorModule,
    Ng2HdModule,
    EntitySelectModule,
    ZSocialSharedModule,
    WMediaPreviewV1Module,

    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,
    PostEditComponent,
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    // MemberListInviteComponent,


    // Comments
    CommentItemEditorComponent
  ],
  providers: [
    PostService
  ]
})

export class PostModule {
}
