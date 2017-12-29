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
import { PostPrivacyCustomComponent } from './post-privacy-custom.component';
import { PostService } from './shared/post.service';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2HdModule,
    SharedModule,
    TagInputModule,
    // BrowserAnimationsModule,
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
