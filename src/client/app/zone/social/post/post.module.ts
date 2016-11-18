import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HdModalModule } from '../../shared/ng2-hd/modal/hd-modal';

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
  PostLikeDislikeComponent
} from './index';
import { TagInputModule } from 'ng2-tag-input';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HdModalModule,
    TagInputModule
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
    PostShareFriendComponent
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
    PostShareFriendComponent
  ]
})

export class PostModule {
}
