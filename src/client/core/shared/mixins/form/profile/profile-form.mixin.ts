import { Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';


declare let _: any;

export class ProfileFormMixin {
  @Input() data: any;
  @Output() eventOut: any;
  @ViewChild('modal') modal: ModalComponent;
  deleteObjects: any = [];
  type: string;
  form: FormGroup;

  onSubmit(values: any) {
    this.data[this.type] = _.concat(this.deleteObjects, values[this.type]);
    this.eventOut.emit(this.data);
    this.modal.close();
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.controls[this.type];
    if (this.data[this.type][i]) {
      this.data[this.type][i]._destroy = true;
      this.deleteObjects.push(this.data[this.type][i]);
    }
    control.removeAt(i);
  }

  removeAll() {
    const control = <FormArray>this.form.controls[this.type];
    control.controls.length = 0;
    this.deleteObjects.length = 0;
    control.reset();
  }

  getFormControls() {
    return (<FormGroup>(<FormGroup>this.form.get(this.type)))['controls'];
  }
}
