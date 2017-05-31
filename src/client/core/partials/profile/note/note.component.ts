import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray, AbstractControl, FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'partials-profile-note',
  templateUrl: 'note.component.html'
})

export class PartialsProfileNoteComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;

  form: FormGroup;
  note: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'note': ['']
    });

    this.note = this.form.controls['note'];
  }

  onOpenModal() {
    (<FormControl>this.note).setValue(this.data);

    this.modal.open();
  }


  onSubmit(values: any): void {
    console.log(values);
  }
}
