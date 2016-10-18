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
  @Output() hideForm: EventEmitter<boolean> = new EventEmitter<boolean>();


  ngOnInit() {

  }

  ngOnChanges() {
    if (this.showForm) {
      $('#form-modal').modal('show');
    }
    this.render();
  }

  ngAfterViewInit() {
    // this.render();
  }

  render() {
    // console.log(this.formData);
    if (this.formData) {
      console.log(this.formData);
      for(let field of this.formData.fields)  {
        field.render();
      }
    }
  }
}
