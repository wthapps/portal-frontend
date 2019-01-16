import { Component, Input, NgZone, ElementRef } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { DomHandler } from 'primeng/components/dom/domhandler';
import { FileUpload } from 'primeng/components/fileupload/fileupload';

@Component({
  selector: 'h-file-upload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.scss'],
  providers: [DomHandler]
})
export class FileUploadComponent extends FileUpload {
  @Input() icon = 'fa-plus';
  constructor(el: ElementRef, sanitizer: DomSanitizer, zone: NgZone) {
    super(el, sanitizer, zone);
  }
}
