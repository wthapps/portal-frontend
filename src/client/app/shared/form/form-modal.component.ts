import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';


@Component({
  moduleId: module.id,
  template: ``,
})
export abstract class FormModalComponent implements OnInit, OnChanges, AfterViewInit {
  showFormModal:boolean;
  // @Input() showForm:boolean;
  // @Output() formResult: EventEmitter<any> = new EventEmitter<any>();
  hideFormModal: EventEmitter= new EventEmitter();
  modalId: string;
  constructor(modalId:string
  ) {
    this.modalId = modalId;
  }
  //
  ngOnInit() {

  }
  //
  ngOnChanges() {
    if (this.showFormModal) {
      $('#' + this.modalId).modal('show');
    } else {
      $('#' + this.modalId).modal('hide');
    }
  }
  //
  ngAfterViewInit() {
    $('#' + this.modalId).on('hidden.bs.modal', (e:any) => {
      // this.hideModal.emit(false);
      this.hideFormModal.emit();
    });
  }
}
