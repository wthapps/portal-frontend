import { Directive, ElementRef, EventEmitter, Input, Output, OnInit, OnDestroy, HostListener } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Uploader, UploadOutput, UploadInput, UploadFile } from './uploader.class';

@Directive({
  selector: '[hFileDrop]'
})
export class FileDropDirective implements OnInit, OnDestroy {
  @Input() uploadInput: EventEmitter<UploadInput>;
  @Output() uploadOutput: EventEmitter<UploadOutput>;

  upload: Uploader;
  el: HTMLInputElement;

  constructor( private elementRef: ElementRef) {
    this.upload = new Uploader();
    this.uploadOutput = new EventEmitter<UploadOutput>();
  }

  ngOnInit() {
    this.el = this.elementRef.nativeElement;

    this.upload.serviceEvents.subscribe((event: UploadOutput) => {
      this.uploadOutput.emit(event);
    });

    if (this.uploadInput instanceof EventEmitter) {
      this.upload.initInputEvents(this.uploadInput);
    }

    this.el.addEventListener('drop', this.stopEvent, false);
    this.el.addEventListener('dragenter', this.stopEvent, false);
    this.el.addEventListener('dragover', this.stopEvent, false);
  }

  ngOnDestroy() {
    if (this.uploadInput) {
      this.uploadInput.unsubscribe();
    }
  }

  stopEvent = (e: Event) => {
    e.stopPropagation();
    e.preventDefault();
  }

  @HostListener('drop', ['$event'])
  onDrop(e: any) {
    e.stopPropagation();
    e.preventDefault();

    const event: UploadOutput = { type: 'drop' };
    this.uploadOutput.emit(event);
    this.upload.handleFiles(e.dataTransfer.files);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(e: Event) {
    if (!e) {
      return;
    }

    const event: UploadOutput = { type: 'dragOver' };
    this.uploadOutput.emit(event);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(e: Event) {
    if (!e) {
      return;
    }

    const event: UploadOutput = { type: 'dragOut' };
    this.uploadOutput.emit(event);
  }
}
