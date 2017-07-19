import { Input, Output, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';


declare let _:any;

export class ProfileFormCustomSubmitMixin {
  @Input() data: any;
  @Output() eventOut: any;
  @ViewChild('modal') modal: ModalComponent;
  deleteObjects: any = [];
  type: string;
  form: FormGroup;

  onCustomSubmit(values: any) {
    this.data[this.type] = values[this.type];
    this.eventOut.emit(this.data);
    this.modal.close();
  };
}
