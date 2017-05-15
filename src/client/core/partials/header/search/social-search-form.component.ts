import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { BaseSearchForm } from './base-search-form';
import { ServiceManager } from '../../../shared/services/service-manager';

declare let _:any;

@Component({
  moduleId: module.id,
  templateUrl: 'social-search-form.component.html',
})

export class SocialSearchFormComponent extends BaseSearchForm implements OnInit {
  result:any;
  groups:any;
  constants:any;
  searchText:any;
  suggestions:any;
  active:boolean;

  constructor(public serviceManager: ServiceManager) {
    super();
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.socialActive;
  }

  showSearchAdvanced() {

  }

  onSubmit(values: any) {
    console.log(values);
  }

  ngOnInit() {

  }

  getSuggestions(e:any) {
    this.serviceManager.getApi().post(`zone/social_network/search`, {q: `${this.searchText}`, types: ['member', 'community']}).subscribe(
      (res:any) => {
        this.suggestions = [];
        this.groups = Object.keys(res.data);
        for (let i=0; i < this.groups.length; i++) {
          for (let j = 0; j < res.data[this.groups[i]].length; j++) {
            let suggestion = res.data[this.groups[i]][j];
            suggestion.type = this.groups[i];
            this.suggestions.push(suggestion);
          }
        }
      }
    );
  }

  onSelect(e:any) {
    this.searchText = e.name;
    this.serviceManager.getRouter().navigate([`${e.link}`]);
  }

  onEnter() {
    this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: `${this.searchText}`}});
    // close suggestions
    if (this.suggestions) {
      this.suggestions.length = 0;
    }
  }
}
