import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ElementRef } from '@angular/core';

import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
}                           from '@angular/forms';

import {
  ToastsService,
  LoadingService,
  ApiBaseService
}                           from '../../../shared/index';

import {
  Photo
}                           from '../../../shared/models/photo.model';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-edit-photo',
  templateUrl: 'form-edit.component.html',
})
export class ZPictureEditPhotoComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow: boolean;
  @Input() data: Photo;
  dataInput: Photo;

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
              private elementRef: ElementRef,
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
    this.dataInput = this.data;
    // if (this.dataInput) {
    //   // update form
    //   (<FormControl>this.name).updateValue(this.dataInput.name);
    //   (<FormControl>this.description).updateValue(this.dataInput.description);
    //
    //   if (this.dataInput.created_at !== null) {
    //     let created_at = new Date(this.dataInput.created_at);
    //     (<FormControl>this.createdDateDay).updateValue(created_at.getDate());
    //     (<FormControl>this.createdDateMonth).updateValue(created_at.getMonth() + 1);
    //     (<FormControl>this.createdDateYear).updateValue(created_at.getUTCFullYear());
    //   }
    //
    // }

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

      this.apiBaseService.put(`zone/photos/${this.dataInput.id}`, body)
        .subscribe((result: any) => {
            // stop loading
            this.loadingService.stop();
            this.dataInput.name = values.name;
            this.dataInput.description = values.description;
            let date_created_at = (values.createdDateYear + '-' + values.createdDateMonth + '-' + values.createdDateDay).toString();
            this.dataInput.created_at = new Date(date_created_at);
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
