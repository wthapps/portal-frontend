import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//noinspection TypeScriptCheckImport
import {
  PostEditComponent,
  PostNewComponent,
  PostActivitiesComponent,
  PostPrivacyCustomComponent,
  PostLikeDislikeComponent,
  PostService
} from './index';
import { Ng2HdModule } from '../../../core/shared/ng2-hd/index';
import { RouterModule } from '@angular/router';

import { InputTextareaModule } from 'primeng/primeng';
// import { HdTagInputModule } from '../../shared/ng2-hd/tag-input/tag-input.module';
import { TagInputModule } from 'ng2-tag-input';
import { CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
import { SharedModule } from '../../../core/shared/shared.module';
// import { MemberListInviteComponent } from '../../communities/member/member-list-invite.component';
// import { TagInputModule } from 'ng2-tag-input/dist/modules/ng2-tag-input.module';
// import { FileSelectionComponent } from '../../../core/partials/zone/photo/file-select/file-selection.component';vi

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Ng2HdModule,
    // HdTagInputModule,
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
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    PostPrivacyCustomComponent,
    // MemberListInviteComponent,
    // Comments
    CommentItemEditorComponent

  ],
  entryComponents: [PostLikeDislikeComponent, PostActivitiesComponent],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // HdTagInputModule,
    Ng2HdModule,
    SharedModule,

    TagInputModule,
    PostNewComponent,
    // FileSelectionComponent,
    // SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    PostPrivacyCustomComponent,
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
