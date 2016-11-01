import { Component, ElementRef, ViewChild, Renderer, OnInit } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'file-selection',
  templateUrl: 'file-selection.component.html'
})

export class FileSelectionComponent implements OnInit{
  @ViewChild('inputfiles') inputFiles: ElementRef;
  selectedFiles: Array<any>;

  constructor(private renderer: Renderer) {
  }

  ngOnInit() {
    this.selectedFiles = new Array<any>();
  }

  open(event: any) {
   event.preventDefault();
    this.renderer.invokeElementMethod(this.inputFiles.nativeElement, 'click');
  }

  chooseFiles(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles.length == 0) {
      return;
    }
  }

}
