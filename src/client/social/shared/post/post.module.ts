import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
// import { HdTagInputModule } from '../../shared/ng2-hd/tag-input/tag-input.module';
import { TagInputModule } from 'ngx-chips';
import { CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
import { CoreSharedModule } from '../../../core/shared/shared.module';
// import { MemberListInviteComponent } from '../../communities/member/member-list-invite.component';
// import { TagInputModule } from 'ng2-tag-input/dist/modules/ng2-tag-input.module';
// import { FileSelectionComponent } from '../../../core/shared/components/zone/photo/file-select/file-selection.component';vi

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Ng2HdModule,
    // HdTagInputModule,
    CoreSharedModule.forRoot(),
    TagInputModule,
    BrowserAnimationsModule,
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
