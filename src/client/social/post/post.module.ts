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
  MemberListInviteComponent,
  PostService
} from './index';
// import { TagInputModule } from 'ng2-tag-input';
// import { Ng2HdModule } from '../../shared/ng2-hd/index';
import { RouterModule } from '@angular/router';

import { InputTextareaModule } from 'primeng/primeng';
import {Ng2HdModule} from "../shared/ng2-hd/ng2-hd.module";
import {HdTagInputModule} from "../shared/ng2-hd/tag-input/tag-input.module";
// import { HdTagInputModule } from '../../shared/ng2-hd/tag-input/tag-input.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Ng2HdModule,
    HdTagInputModule,
    // TagInputModule,
    InputTextareaModule
  ],
  declarations: [
    PostNewComponent,
    // FileSelectionComponent,
    // SoPhotoListComponent,
    // PostEditComponent,
    // PostNewComponent,
    // PostPhotoSelectComponent,
    // PostActivitiesComponent,
    // PostLikeDislikeComponent,
    // PostPrivacyCustomComponent,
    // MemberListInviteComponent
  ],
  exports: [
    CommonModule,
    // FormsModule,
    // ReactiveFormsModule,
    // HdTagInputModule,
    // // TagInputModule,
    // PostNewComponent,
    // FileSelectionComponent,
    // SoPhotoListComponent,
    // PostEditComponent,
    // PostNewComponent,
    // PostPhotoSelectComponent,
    // PostActivitiesComponent,
    // PostLikeDislikeComponent,
    // PostPrivacyCustomComponent,
    // MemberListInviteComponent
  ],
  providers: [
    PostService
  ]
})

export class PostModule {
}
