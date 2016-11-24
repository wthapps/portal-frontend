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
  PostLikeDislikeComponent
} from './index';
import { TagInputModule } from 'ng2-tag-input';
import { Ng2HdModule } from '../../shared/ng2-hd/index';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2HdModule,
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
