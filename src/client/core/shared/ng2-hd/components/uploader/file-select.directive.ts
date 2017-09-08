import { Directive, ElementRef, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Uploader, UploadOutput, UploadInput, UploadFile } from './uploader.class';

@Directive({ selector: '[hFileSelect]' })

export class FileSelectDirective implements OnInit, OnDestroy {
  @Input() uploadInput: EventEmitter<any>;
  @Output() uploadOutput: EventEmitter<UploadOutput>;

  upload: Uploader;
  el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.upload = new Uploader();
    this.uploadOutput = new EventEmitter<UploadOutput>();
  }

  ngOnInit() {
    this.el = this.elementRef.nativeElement;
    this.el.addEventListener('change', this.fileListener, false);

    this.upload.serviceEvents.subscribe((event: UploadOutput) => {
      this.uploadOutput.emit(event);
    });

    if (this.uploadInput instanceof EventEmitter) {
      this.upload.initInputEvents(this.uploadInput);
    }
  }

  ngOnDestroy() {
    this.el.removeEventListener('change', this.fileListener, false);

    if (this.uploadInput) {
      this.uploadInput.unsubscribe();
    }
  }

  fileListener = () => {
    if (this.el.files) {
      this.upload.handleFiles(this.el.files);
    }
  }
}
