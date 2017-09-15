import {
  Component,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostBinding, OnInit, AfterViewInit, AfterContentInit, NgZone
} from '@angular/core';

import { DomHandler } from "primeng/components/dom/domhandler";
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from 'primeng/primeng';

declare var $: any;

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
