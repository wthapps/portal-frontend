import { Component, OnChanges, Input, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import Media from '@shared/modules/photo/models/media.model';

@Component({
  selector: 'shared-modals-photoEditInfo',
  templateUrl: './photo-edit-info.component.html'
})
export class WModalsPhotoEditInfoComponent implements OnChanges {
  @Input() data: Media = null;
  @ViewChild('modal') modal: BsModalComponent;

  form: FormGroup;
  name: AbstractControl;
  created_at: AbstractControl;
  description: AbstractControl;
  date: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      'name': ['',
        Validators.compose([Validators.required])
      ],
      'description': [''],
      'date': ['']
    });

    this.name = this.form.controls['name'];
    this.description = this.form.controls['description'];
    this.date = this.form.controls['date'];
  }

  ngOnChanges(data) {
    if (this.data) {
      this.updateForm(this.data);
    }
  }

  open(): Observable<any> {
    this.modal.open();
    return from(this.modal.onClose).pipe(
      map(() => this.data)
    );
  }

  updateForm(values: any) {
    this.data = values;

    (<FormControl>this.name).setValue(values.name);
    (<FormControl>this.description).setValue(values.description);

    if (values.created_at !== null) {
      const created_at = new Date(values.created_at);
      (<FormControl>this.date).setValue(created_at);
    }
  }

  onSubmit(values: any) {
    if (this.form.valid) {
      this.data.name = values.name;
      this.data.created_at = new Date(values.date);
      this.data.description = values.description || '';
      this.modal.close();
    }
  }
}
