import { Component, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ServiceManager } from '../../../services/service-manager';
import { TextBoxSearchComponent } from './components/textbox-search.component';

declare let _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'photo-search-form.component.html',
})

export class PhotoSearchFormComponent {
  /*constants: any;
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

   */
  constants: any;
  suggestions: any = [];
  active: boolean = false;
  show: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  form: FormGroup;
  searchFrom: AbstractControl;
  searchTo: AbstractControl;
  searchFileType: AbstractControl;
  searchTags: AbstractControl;
  searchOwner: AbstractControl;
  searchGroup: AbstractControl;
  searchContact: AbstractControl;
  searchAdvanced: boolean = false;

  constructor(public serviceManager: ServiceManager) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.photoActive;

    this.createForm();
  }

  onEnter(e: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: e.search}});
  }

  onEscape(e?: any) {
    console.log('inside onEscape', e);
  }

  onKey(e: any) {
    console.log(e);
    if (!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    this.serviceManager.getApi().post(`media/search/suggestions`, {
      q: `${this.search}`
    }).subscribe(
      (res: any) => {
        this.suggestions.length = 0;
        console.log(res);
      }
    );
  }

  onNavigation(data: any) {
    this.show = false;
  }

  onSearchAdvanced(e: any) {
    console.log(e);
    this.searchAdvanced = e.searchAdvanced;
  }

  createForm() {
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

  onSubmit(values: any) {
    console.log(values);
  }
}
