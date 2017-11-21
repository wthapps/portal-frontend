import { Component, ElementRef, ViewChild, Renderer, OnInit, Output, EventEmitter, Input } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'file-browse',
  templateUrl: 'file-browse.component.html'
})

export class FileBrowseComponent implements OnInit {
  @ViewChild('fileBrowse') inputFiles: ElementRef;
  @Output() onFilesChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() multipleSelect: boolean = true;

  selectedFiles: Array<any> = new Array<any>();

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.selectedFiles = new Array<any>();
  }

  open(event: any) {
    event.preventDefault();
    this.renderer.invokeElementMethod(this.inputFiles.nativeElement, 'click');
  }

  changeFiles(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.length == 0) {
      return;
    }
    this.onFilesChanged.emit(this.selectedFiles);
  }

}
