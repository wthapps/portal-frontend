/*
* This module is forked from
* https://github.com/jkuri/ngx-uploader
* */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileDropDirective } from './file-drop.directive';
import { FileSelectDirective } from './file-select.directive';
import { FileUploadComponent } from './file-upload.component';
import { ButtonModule, ProgressBarModule, SharedModule, MessagesModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
    ProgressBarModule,
    MessagesModule
  ],
  declarations: [
    // components
    FileUploadComponent,

    // directives
    FileSelectDirective,
    FileDropDirective
  ],
  exports: [
    // components
    FileUploadComponent,

    // directives
    FileSelectDirective,
    FileDropDirective
  ]
})

export class UploaderModule {}
