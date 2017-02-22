import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
}                           from '@angular/forms';
import { Photo } from '../../../core/shared/models/photo.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';

// import {
//   ToastsService,
//   LoadingService,
//   ApiBaseService
// }                           from '../../../shared/index';

// import {
//   Photo
// }                           from '../../../shared/models/photo.model';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-edit-photo',
  templateUrl: 'form-edit-photo.component.html'
})
export class ZPictureEditPhotoComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow: boolean;
  @Input() data: Photo;

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
              private apiBaseService: ApiBaseService,
              private toastsService: ToastsService,
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

  ngOnInit() {

  }

  ngAfterViewInit() {
    let _this = this;
    $('#editPhotoModal').on('hidden.bs.modal', function (e: any) {
      _this.modalHide.emit(false);
    });
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

    if (this.modalShow) {
      $('#editPhotoModal').modal('show');
    }
  }


  onSubmit(values: any): void {
    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    if (this.form.valid) {

      $('#editPhotoModal').modal('hide');
      // start loading
      this.loadingService.start();
      let body = JSON.stringify({
        name: values.name,
        created_day: values.createdDateDay.toString(),
        created_month: values.createdDateMonth.toString(),
        created_year: values.createdDateYear.toString(),
        description: values.description
      });

      this.apiBaseService.put(`zone/photos/${this.data.id}`, body)
        .subscribe((result: any) => {
            // stop loading
            this.loadingService.stop();
            this.data.name = values.name;
            this.data.description = values.description;
            let date_created_at = (values.createdDateYear + '-' + values.createdDateMonth + '-' + values.createdDateDay).toString();
            this.data.created_at = new Date(date_created_at);
            this.updatePhoto.emit(this.data);
            //this.toastsService.success(result.message);
          },
          error => {
            // stop loading
            this.loadingService.stop();
            //this.toastsService.danger(error);
            console.log(error);
          }
        );
    }
  }
}
