import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ServiceManager } from '../../../shared/services/service-manager';
import { Constants } from '../../../shared/config/constants';

declare let _:any;

@Component({
  moduleId: module.id,
  templateUrl: 'contact-search-form.component.html',
})

export class ContactSearchFormComponent implements OnInit {
  result:any;
  groups:any;
  constants:any;
  searchText:any;
  suggestions:any;
  active:boolean;
  contactUrl: string = Constants.urls.contacts;

  constructor(public serviceManager: ServiceManager) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.contactActive;
  }

  showSearchAdvanced() {

  }

  onSubmit(values: any) {
    console.log(values);
  }

  ngOnInit() {

  }

  getSuggestions(e:any) {
    // this.serviceManager.getApi().post(`zone/social_network/search`, {q: `${this.searchText}`, types: ['member', 'community']}).subscribe(
    //   (res:any) => {
    //     this.suggestions = [];
    //     this.groups = Object.keys(res.data);
    //     for (let i=0; i < this.groups.length; i++) {
    //       for (let j = 0; j < res.data[this.groups[i]].length; j++) {
    //         let suggestion = res.data[this.groups[i]][j];
    //         suggestion.type = this.groups[i];
    //         this.suggestions.push(suggestion);
    //       }
    //     }
    //   }
    // );

    console.log('inside Contact getSuggestion.', this.searchText);
  }

  onSelect(e:any) {
    this.serviceManager.getRouter().navigate([`${this.contactUrl},${e.id}`]);
    console.log('inside Contact onSelect.', this.searchText, e);

    // this.searchText = e.name;
    // this.serviceManager.getRouter().navigate([`${e.link}`]);
  }

  onEnter() {
    // this.serviceManager.getRouter().navigate([`/search`], {queryParams: {q: `${this.searchText}`}});
    // // close suggestions
    // if (this.suggestions) {
    //   this.suggestions.length = 0;
    // }

    this.serviceManager.getCommonEventService().broadcast({action: 'contact:contact:search', payload: {search_value: this.searchText}});
    console.log('inside Contact onEnter().');
  }
}
