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
import { Ng2HdModule } from '../../../../core/shared/ng2-hd/index';
import { RouterModule } from '@angular/router';

import { InputTextareaModule } from 'primeng/components/inputtextarea/inputtextarea';
import { TagInputModule } from 'ngx-chips';
import { CommentItemEditorComponent } from './components/comment/comment-item-editor.component';
import { CoreSharedModule } from '../../../../core/shared/shared.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2HdModule,
    CoreSharedModule.forRoot(),
    TagInputModule,
    BrowserAnimationsModule,
    InputTextareaModule


  ],
  declarations: [
    PostNewComponent,
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
    Ng2HdModule,

    TagInputModule,
    PostNewComponent,
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
