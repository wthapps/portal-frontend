import { Component, OnInit, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ViewChild } from '@angular/core/src/metadata/di';
import { Constants } from '../../../shared/config/constants';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  templateUrl: 'photo-search-form.component.html',
})

export class PhotoSearchFormComponent {
  text: any;
  active: any;
  constants: any;
  searchAdvanced: boolean = false;

  form: FormGroup;
  searchFrom: AbstractControl;
  searchTo: AbstractControl;
  searchFileType: AbstractControl;
  searchTags: AbstractControl;
  searchOwner: AbstractControl;
  searchGroup: AbstractControl;
  searchContact: AbstractControl;

  constructor(private fb: FormBuilder) {
    this.constants = Constants;
    this.active = this.constants.search.config.photoActive;

    this.form = fb.group({
      'searchFrom': [''],
      'searchTo': [''],
      'searchFileType': [''],
      'searchTags': [''],
      'searchOwner': [''],
      'searchGroup': [''],
      'searchContact': ['']
    });

    this.searchFrom = this.form.controls['searchFrom'];
    this.searchTo = this.form.controls['searchTo'];
    this.searchFileType = this.form.controls['searchFileType'];
    this.searchTags = this.form.controls['searchTags'];
    this.searchOwner = this.form.controls['searchOwner'];
    this.searchGroup = this.form.controls['searchGroup'];
    this.searchContact = this.form.controls['searchContact'];
  }

  showSearchAdvanced() {
    this.searchAdvanced = !this.searchAdvanced;
  }

  onSubmit(values: any) {
    console.log(values);
  }
}
