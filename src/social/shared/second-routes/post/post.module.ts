import { ZSocialSharedModule } from './../../shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RouterModule } from '@angular/router';

import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { TagInputModule } from 'ngx-chips';
import { CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
import { Ng2HdModule } from '@wth/shared/shared/ng2-hd';
import { SharedModule } from '@wth/shared/shared.module';
import { PostNewComponent } from './post-new.component';
import { PostEditComponent } from './post-edit.component';
import { PostActivitiesComponent } from './post-activities.component';
import { PostLikeDislikeComponent } from './post-likedislike.component';
import { PostService } from './shared/post.service';
import { MiniEditorModule } from '@wth/shared/shared/components/mini-editor/mini-editor.module';
import { PostListComponent } from '@social/shared/second-routes/post/post-list.component';
import { PostHeaderComponent, PostBodyComponent, PostFooterComponent } from '@social/shared/second-routes/post/components';
import { PostComponent } from '@social/shared/second-routes/post/post.component';
import { PostDetailComponent } from '@social/shared/second-routes/post/post-detail.component';
import { PostDetailPhotoComponent } from '@social/shared/second-routes/post/post-detail-photo.component';
import { WTHEmojiModule } from '@shared/components/emoji/emoji.module';
import { ReadMoreModule } from '@shared/shared/components/read-more/read-more.module';
import { DisplayLinkModule } from '@shared/shared/components/link/display-link.module';
import { EntitySelectModule } from '@shared/shared/components/entity-select/entity-select.module';
import { PhotoItemPreviewComponent } from '@shared/shared/components/photo/photo-item-preview.component';
import { PartialsPhotoModule } from '@shared/shared/components/photo/photo.module';
import { InputSwitchModule, CheckboxModule } from 'primeng/primeng';
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
    // BrowserAnimationsModule,
    InputTextareaModule


  ],
  declarations: [
    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,
    PostDetailPhotoComponent,

    PostNewComponent,
    PostEditComponent,
    PostNewComponent,
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

    // List Posts
    PostListComponent,
    PostComponent,
    PostHeaderComponent,
    PostBodyComponent,
    PostFooterComponent,
    PostDetailComponent,
    PostDetailPhotoComponent,
    PostNewComponent,
    PostEditComponent,
    PostNewComponent,
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
