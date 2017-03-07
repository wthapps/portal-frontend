import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { LoadingService } from '../../../core/partials/loading/loading.service';
import { Photo } from '../../../core/shared/models/photo.model';

import { ZMediaPhotoService } from '../photo.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-form-edit',
  templateUrl: 'form-edit-photo.component.html'
})
export class ZMediaPhotoFormEditComponent implements OnChanges {
  @Input() data: Photo = null;
  @ViewChild('modal') modal: ModalComponent;

  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updatePhoto: EventEmitter<Photo> = new EventEmitter<Photo>();

  formValue: any;
  form: FormGroup;
  name: AbstractControl;
  created_at: AbstractControl;
  description: AbstractControl;

  createdDateDay: AbstractControl;
  createdDateMonth: AbstractControl;
  createdDateYear: AbstractControl;

  constructor(private fb: FormBuilder,
              private photoService: ZMediaPhotoService,
              private loadingService: LoadingService) {
    this.form = fb.group({
      'name': ['',
        Validators.compose([Validators.required])
      ],
      'createdDateDay': [0],
      'createdDateMonth': [0],
      'createdDateYear': [0],
      'description': ['']
    });

    this.name = this.form.controls['name'];
    this.createdDateDay = this.form.controls['createdDateDay'];
    this.createdDateMonth = this.form.controls['createdDateMonth'];
    this.createdDateYear = this.form.controls['createdDateYear'];
    this.description = this.form.controls['description'];
  }

  ngOnChanges() {
    if (this.data) {
      // update form
      (<FormControl>this.name).setValue(this.data.name);
      (<FormControl>this.description).setValue(this.data.description);

      if (this.data.created_at !== null) {
        let created_at = new Date(this.data.created_at);
        (<FormControl>this.createdDateDay).setValue(created_at.getDate());
        (<FormControl>this.createdDateMonth).setValue(created_at.getMonth() + 1);
        (<FormControl>this.createdDateYear).setValue(created_at.getUTCFullYear());
      }
    }
  }

  onShow() {
    this.modal.open();
  }

  onSubmit(values: any): void {
    this.modal.close();

    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    if (this.form.valid) {
      this.modal.close();
      // start loading
      this.loadingService.start();
      let body = JSON.stringify({
        name: values.name,
        created_day: values.createdDateDay.toString(),
        created_month: values.createdDateMonth.toString(),
        created_year: values.createdDateYear.toString(),
        description: values.description
      });

      this.photoService.updateInfo(this.data.id, body)
        .subscribe((res: any) => {
            // stop loading
            console.log(res);
            this.loadingService.stop();
            this.data.name = values.name;
            this.data.description = values.description;
            let date_created_at = (values.createdDateYear + '-' + values.createdDateMonth + '-' + values.createdDateDay).toString();
            this.data.created_at = new Date(date_created_at);
          },
          (error: any) => {
            // stop loading
            this.loadingService.stop();
            console.log(error);
          }
        );
    }
  }
}
