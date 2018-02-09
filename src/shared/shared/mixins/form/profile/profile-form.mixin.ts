import { Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';


declare let _: any;

export class ProfileFormMixin {
  @Input() data: any;
  @Output() eventOut: any;
  @ViewChild('modal') modal: BsModalComponent;
  deleteObjects: any = [];
  type: string;
  form: FormGroup;

  onSubmit(values: any) {
    this.data[this.type] = _.concat(this.deleteObjects, values[this.type]);
    this.eventOut.emit(this.data);
    this.modal.close();
  }

  removeItem(i: number, item: any) {
    const control = <FormArray>this.form.controls[this.type];
    control.removeAt(i);
    if (item && item.id && item.id.value) {
      _.forEach(this.data[this.type], (data: any) => {
        if (data.id == item.id.value) {
          data._destroy = true;
          this.deleteObjects.push(data);
        }
      });
    }
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
