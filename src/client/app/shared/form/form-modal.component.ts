import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';


@Component({
  moduleId: module.id,
})
export abstract class FormModalComponent implements OnInit, OnChanges, AfterViewInit {
  showForm:boolean;
  // @Input() showForm:boolean;
  // @Output() formResult: EventEmitter<any> = new EventEmitter<any>();
  hideModal: EventEmitter= new EventEmitter();
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
    console.log(this.showForm);
    if (this.showForm) {
      $('#' + this.modalId).modal('show');
    } else {
      $('#' + this.modalId).modal('hide');
    }
  }
  //
  ngAfterViewInit() {
    $('#' + this.modalId).on('hidden.bs.modal', (e:any) => {
      // this.hideModal.emit(false);
      this.hideModal.emit();
    });
  }
}
