import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'so-photo-selection',
  templateUrl: 'photo-selection.component.html'
})

export class SoPhotoSelectionComponent {
  @ViewChild('fileselection') fileSelection: ElementRef;
  @ViewChild('socialmodal') socialModal: ElementRef;

  constructor(private renderer: Renderer) {
  }

  open(event: any) {
    // this.socialModal.modal.open();
    $('#socialmodal').modal({
      backdrop: 'static'
    });
  }

}
