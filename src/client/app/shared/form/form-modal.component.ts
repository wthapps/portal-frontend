import { Component } from '@angular/core';


declare var $: any;

@Component({
  moduleId: module.id,
  template: ``,
})

export class FormModalComponent {
  modalId: string;

  constructor(modalId: string) {
    this.modalId = modalId;
  }

  show() {
    $('#' + this.modalId).modal('show');
  }

  hide() {
    $('#' + this.modalId).modal('hide');
  }
}
