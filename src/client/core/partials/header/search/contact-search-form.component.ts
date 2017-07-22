import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { ServiceManager } from '../../../shared/services/service-manager';
import { Constants } from '../../../shared/config/constants';
// import { ZContactService } from '../../../../contact/shared/services/contact.service';
import { Observable } from 'rxjs/Observable';

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

  suggest$: Observable<any>;

  constructor(public serviceManager: ServiceManager,
              // public contactService: ZContactService
  ) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.contactActive;
    // this.suggest$ = this.contactService.suggest$
    ;
  }

  showSearchAdvanced() {

  }

  onSubmit(values: any) {
    console.log(values);
  }

  ngOnInit() {

  }

  getSuggestions(e:any) {
    // this.contactService.suggestContacts(this.searchText);

    console.log('inside Contact getSuggestion.', this.searchText);
  }

  onSelect(e:any) {
    // this.serviceManager.getRouter().navigate([`${this.contactUrl},${e.id}`]);
    console.log('inside Contact onSelect.', this.searchText, e);

    // this.searchText = e.name;
    // this.serviceManager.getRouter().navigate([`${e.link}`]);
  }

  onEscape(e: any) {
    this.searchText = '';
    this.onEnter();
  }

  onEnter() {
    this.serviceManager.getCommonEventService().broadcast({action: 'contact:contact:search', payload: {search_value: this.searchText}});
  }
}
