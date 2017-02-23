import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//noinspection TypeScriptCheckImport
import {
  SoPhotoListComponent,
  FileSelectionComponent,
  PostEditComponent,
  PostPhotoSelectComponent,
  PostNewComponent,
  PostActivitiesComponent,
  PostPrivacyCustomComponent,
  PostLikeDislikeComponent,
  PostService
} from './index';
// import { TagInputModule } from 'ng2-tag-input';
import { Ng2HdModule } from '../../shared/ng2-hd/index';
import { RouterModule } from '@angular/router';

import { InputTextareaModule } from 'primeng/primeng';
import { HdTagInputModule } from '../../shared/ng2-hd/tag-input/tag-input.module';
import { TagInputModule } from 'ng2-tag-input';

// import { HdTagInputModule } from '../../shared/ng2-hd/tag-input/tag-input.module';

// import {
//   PostComponent,
//   PostHeaderComponent,
//   PostBodyComponent,
//   PostFooterComponent
// } from './index';
// import { PostListComponent } from './post-list.component';
// import { PostDetailComponent } from './post-detail.component';
// import { PostDetailPhotoComponent } from './post-detail-photo.component';
import { ZSocialCommentBoxComponent } from './components/sub-layout/comment-box.component';
import { SharedModule } from '../../../core/shared/shared.module';
import { MemberListInviteComponent } from '../../communities/member/member-list-invite.component';
import { ZSocialProfilePostComponent } from '../../profile/post/post.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Ng2HdModule,
    HdTagInputModule,
    Ng2HdModule,
    SharedModule,
    TagInputModule,
    InputTextareaModule


  ],
  declarations: [
    PostNewComponent,
    FileSelectionComponent,
    // SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    // PostPhotoSelectComponent,
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    PostPrivacyCustomComponent,
    MemberListInviteComponent,
    // Comments
    ZSocialCommentBoxComponent

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HdTagInputModule,
    Ng2HdModule,

    // TagInputModule,
    PostNewComponent,
    FileSelectionComponent,
    // SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    // PostPhotoSelectComponent,
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    PostPrivacyCustomComponent,
    MemberListInviteComponent,



    // Comments
    ZSocialCommentBoxComponent
  ],
  providers: [
    PostService
  ]
})

export class PostModule {
}
