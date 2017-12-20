import { Component, Input, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ApiBaseService } from '../../../../services/apibase.service';

declare var _: any;

@Component({
    selector: 'partials-profile-note',
  templateUrl: 'note.component.html'
})

export class PartialsProfileNoteComponent {
  @Input('data') data: any;
  @ViewChild('modal') modal: ModalComponent;
  @Input() editable: boolean;

  form: FormGroup;
  contact_note: AbstractControl;

  constructor(private fb: FormBuilder, private apiBaseService: ApiBaseService) {
    this.form = fb.group({
      'contact_note': ['']
    });
    //
    this.contact_note = this.form.controls['contact_note'];
  }

  onOpenModal() {
    (<FormControl>this.contact_note).setValue(this.data.contact_note);

    this.modal.open();
  }


  onSubmit(values: any): void {
    this.apiBaseService.put('zone/social_network/users/' + this.data.uuid, values).subscribe((res:any) => {
      this.data = res.data;
      (<FormControl>this.contact_note).setValue(this.data.contact_note);
      this.modal.close();
    });
  }
}
