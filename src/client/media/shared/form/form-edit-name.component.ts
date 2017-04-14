import { Component, Input, ViewChild, AfterViewInit, OnInit, OnChanges } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';

import { Constants } from '../../../core/shared/config/constants';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { ZMediaPhotoService } from '../../photo/photo.service';


declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-edit-name-modal',
  templateUrl: 'form-edit-name.component.html',
})
export class BaseObjectEditNameModalComponent implements OnInit, OnChanges {
  @ViewChild('modal') modal: ModalComponent;

  @Input() data: any = null;

  formValue: any;
  form: FormGroup;
  name: AbstractControl;
  created_at: AbstractControl;
  description: AbstractControl;

  createdDateDay: AbstractControl;
  createdDateMonth: AbstractControl;
  createdDateYear: AbstractControl;

  private urls = Constants.urls;

  constructor(private fb: FormBuilder,
              private loadingService: LoadingService,
              private photoService: ZMediaPhotoService) {
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

  ngOnInit(): void {

  }

  ngOnChanges(): void {
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

  open(options?: any) {
    this.modal.open();
  }

  onSubmit(values: any): void {
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

      // console.log(body);

      this.photoService.updateInfo(this.data.id, body)
        .subscribe((res: any) => {
            // stop loading
            // console.log(res);
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
