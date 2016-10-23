import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';
import {FormManagerService} from "./form-manager.service";


declare var $: any;

@Component({
  moduleId: module.id,
  template: ``,
})

export abstract class FormModalComponent implements OnInit, OnChanges, AfterViewInit {
  formMangerService: FormManagerService;
  hideFormModal: EventEmitter= new EventEmitter();
  modalId: string;

  constructor(modalId:string
  ) {
    this.modalId = modalId;
  }
  //
  ngOnInit() {
    this.formMangerService.register(this.modalId);
  }
  //
  ngOnChanges() {
    // console.log('change3', this.formMangerService);
  }

  ngDoCheck() {
    if (this.formMangerService) {
      if (this.formMangerService.isShow(this.modalId)) {
        $('#' + this.modalId).modal('show');
      } else {
        $('#' + this.modalId).modal('hide');
      }
    }
  }
  //
  ngAfterViewInit() {
    $('#' + this.modalId).on('hidden.bs.modal', (e:any) => {
      this.formMangerService.hideAll();
    });
  }
}
