import { Component, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

import { TextBoxSearchComponent } from '../../../core/shared/components/header/search/components/textbox-search.component';
import { ServiceManager } from '../../../core/shared/services/service-manager';

declare var _:any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'media-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})
export class ZMediaSharedHeaderComponent {
  constants: any;
  suggestions: any = [];
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
      q: `name:${this.search}`
    }).subscribe(
      (res: any) => {
        this.suggestions.length = 0;
        this.suggestions = _.map(res.data, 'name');
      }
    );
  }

  onNavigation(data: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: data}});
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
