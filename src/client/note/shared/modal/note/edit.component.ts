import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-note-shared-modal-note-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ZNoteSharedModalNoteEditComponent {
  @ViewChild('modal') modal: ModalComponent;

  titleModal: string = 'New Note';

  form: FormGroup;
  name: AbstractControl;
  content: AbstractControl;
  tags: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['', Validators.compose([Validators.required])],
      'content': [''],
      'tags': [''],
    });

    this.name = this.form.controls['name'];
    this.content = this.form.controls['content'];
    this.tags = this.form.controls['tags'];
  }

  open() {
    this.modal.open()
  }

  onSubmit(value: any) {
    console.log(value);
  }
}
