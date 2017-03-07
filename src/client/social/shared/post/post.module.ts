import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//noinspection TypeScriptCheckImport
import {
  PostEditComponent,
  PostPhotoSelectComponent,
  PostNewComponent,
  PostActivitiesComponent,
  PostPrivacyCustomComponent,
  PostLikeDislikeComponent,
  PostService
} from './index';
import { Ng2HdModule } from '../../shared/ng2-hd/index';
import { RouterModule } from '@angular/router';

import { InputTextareaModule } from 'primeng/primeng';
import { HdTagInputModule } from '../../shared/ng2-hd/tag-input/tag-input.module';
import { TagInputModule } from 'ng2-tag-input';
import { ZSocialCommentBoxComponent } from './components/sub-layout/comment-box.component';
import { SharedModule } from '../../../core/shared/shared.module';
import { MemberListInviteComponent } from '../../communities/member/member-list-invite.component';
// import { FileSelectionComponent } from '../../../core/partials/zone/photo/file-select/file-selection.component';

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
    // FileSelectionComponent,
    // SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    PostPhotoSelectComponent,
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
    SharedModule,

    // TagInputModule,
    PostNewComponent,
    // FileSelectionComponent,
    // SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    PostPhotoSelectComponent,
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
