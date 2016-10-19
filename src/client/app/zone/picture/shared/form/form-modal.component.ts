import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';

import {FormTextElement} from "../../../../shared/models/form/form-text-element.model";
import {FormBase} from "../../../../shared/models/form/form-base.model";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'form-modal',
  templateUrl: 'form-modal.component.html',
})
export class FormModal implements OnInit, OnChanges {
  @Input() showForm:boolean;
  @Input() formData:FormBase;
  @Output() formResult: EventEmitter<any> = new EventEmitter<any>();
  @Output() hideModal: EventEmitter<boolean> = new EventEmitter<boolean>();


  ngOnInit() {

  }

  ngOnChanges() {
    if (this.showForm) {
      $('#form-modal').modal('show');
    }
    this.render();
  }

  ngAfterViewInit() {
    $('#form-modal').on('hidden.bs.modal', (e:any) => {
      this.hideModal.emit(false);
    });
  }

  render() {
    if (this.formData) {
      $('#form-elements').empty();
      for(let field of this.formData.fields)  {
        field.render();
      }
    }
  }

  onClick() {
    let res = {};
    for(let field of this.formData.fields)  {
      res[field.id] = $("#" + field.id).val();
    }
    $('#form-modal').modal('hide');
    this.formResult.emit(res);
  }
}
