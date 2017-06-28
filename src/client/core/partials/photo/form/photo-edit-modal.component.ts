import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Photo } from '../../../shared/models/photo.model';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'photo-edit-modal',
  templateUrl: 'photo-edit-modal.component.html'
})
export class PhotoEditModalComponent implements OnChanges, BaseMediaModal {
  @Input() data: Photo = null;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: ModalComponent;

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
      'date': [''],
    });

    this.name = this.form.controls['name'];
    this.description = this.form.controls['description'];
    this.date = this.form.controls['date'];
  }

  ngOnChanges() {
    if (this.data) {
      // update form
      this.updateForm(this.data);
    }
  }

  open(options?: any) {
    // console.log(options);
    this.data = options['selectedObject'];
    this.updateForm(options['selectedObject']);

    this.modal.open();
  }

  close(options?: any) {
    this.modal.close();
  }

  onShow() {
    this.modal.open();
  }

  updateForm(values: any) {
    (<FormControl>this.name).setValue(values.name);
    (<FormControl>this.description).setValue(values.description);

    if (values.created_at !== null) {
      let created_at = new Date(values.created_at);
      (<FormControl>this.date).setValue(created_at);
    }
  }

  onSubmit(values: any): void {
    if (this.form.valid) {
      this.modal.close();
      this.data.name = values.name;
      this.data.created_at = new Date(values.date);
      this.data.description = values.description;

      this.event.emit({action: 'editInfo', params: {selectedObject: this.data}});
    }
  }
}
