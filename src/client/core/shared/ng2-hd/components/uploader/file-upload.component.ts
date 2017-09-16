import {
  Component,
  Input,
  NgZone
} from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import { DomHandler } from "primeng/components/dom/domhandler";
import { FileUpload } from 'primeng/primeng';

@Component({
  moduleId: module.id,
  selector: 'h-fileUpload',
  templateUrl: 'file-upload.component.html',
  styleUrls: ['file-upload.component.css'],
  providers: [DomHandler]
})
export class FileUploadComponent extends FileUpload {

  @Input() icon: string = 'fa-plus';
  constructor(domHandler: DomHandler, sanitizer: DomSanitizer, zone: NgZone){
    super(domHandler, sanitizer, zone);
  }
}
