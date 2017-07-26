import { Component } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ServiceManager } from '../../../services/service-manager';

declare let _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'photo-search-form.component.html',
})

export class PhotoSearchFormComponent {
  constants: any;
  form: FormGroup;
  searchFrom: AbstractControl;
  searchTo: AbstractControl;
  searchFileType: AbstractControl;
  searchTags: AbstractControl;
  searchOwner: AbstractControl;
  searchGroup: AbstractControl;
  searchContact: AbstractControl;
  searchText: any;
  suggestions: any;
  searchAdvanced: any;
  active: any;

  constructor(public serviceManager: ServiceManager) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.photoActive;

    this.form = this.serviceManager.getFormBuilder().group({
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

  getSuggestions(e: any) {
    this.serviceManager.getApi().post(`media/search/suggestions`, {q: `name:${this.searchText}`}).subscribe(
      (res: any) => {
        this.suggestions = _.map(res.data, 'name');
      }
    );
  }

  onEnter() {
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: `${this.searchText}`}});
  }

}
