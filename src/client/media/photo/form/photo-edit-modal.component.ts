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
  selector: 'photo-edit-modal',
  templateUrl: 'photo-edit-modal.component.html'
})
export class PhotoEditModalComponent implements OnChanges, BaseMediaModal {
  @Input() data: Photo = null;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: ModalComponent;

  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() updatePhoto: EventEmitter<Photo> = new EventEmitter<Photo>();

  formValue: any;
  form: FormGroup;
  name: AbstractControl;
  created_at: AbstractControl;
  description: AbstractControl;

  date: AbstractControl;

  constructor(private fb: FormBuilder,
              private photoService: ZMediaPhotoService,
              private loadingService: LoadingService) {
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
    this.data = options['selectedItems'][0];
    this.updateForm(options['selectedItems'][0]);

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

    this.event.emit({action: 'editInfo', params: {selectedObject: values}});

    //TODO move this logic into container or media list view
    // Set value after updating form (checking user leave this page)
    this.formValue = values;

    if (this.form.valid) {
      this.modal.close();
      // start loading
      this.loadingService.start();

      let updated_at = new Date(values.date);

      let body = JSON.stringify({
        name: values.name,
        created_day: updated_at.getDate(),
        created_month: updated_at.getMonth() + 1,
        created_year: updated_at.getUTCFullYear(),
        description: values.description
      });

      this.photoService.updateInfo(this.data.id, body)
        .subscribe((res: any) => {
            // stop loading
            // console.log(res);
            this.loadingService.stop();
            this.data.name = values.name;
            this.data.description = values.description;
            this.data.created_at = new Date(values.date);
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
