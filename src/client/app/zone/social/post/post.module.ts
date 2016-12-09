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
  PostShareComponent,
  PostActivitiesComponent,
  PostShareCommunityComponent,
  PostShareFriendComponent,
  PostLikeDislikeComponent,
  MemberListInviteComponent
} from './index';
import { TagInputModule } from 'ng2-tag-input';
import { Ng2HdModule } from '../../shared/ng2-hd/index';
import { RouterModule } from '@angular/router';

import { InputTextareaModule } from 'primeng/primeng';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2HdModule,
    TagInputModule,
    InputTextareaModule
  ],
  declarations: [
    PostNewComponent,
    FileSelectionComponent,
    SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    PostPhotoSelectComponent,
    PostShareComponent,
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    PostShareCommunityComponent,
    PostShareFriendComponent,
    MemberListInviteComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TagInputModule,
    PostNewComponent,
    FileSelectionComponent,
    SoPhotoListComponent,
    PostEditComponent,
    PostNewComponent,
    PostPhotoSelectComponent,
    PostShareComponent,
    PostActivitiesComponent,
    PostLikeDislikeComponent,
    PostShareCommunityComponent,
    PostShareFriendComponent,
    MemberListInviteComponent
  ]
})

export class PostModule {
}
