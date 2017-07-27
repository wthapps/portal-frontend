import { Component, ViewChild } from '@angular/core';
import { ServiceManager } from '../../../services/service-manager';
import { Constants } from '../../../config/constants';
import { Observable } from 'rxjs/Observable';
import { TextBoxSearchComponent } from './components/textbox-search.component';
// import { ZContactService } from '../../../../../contact/shared/services/contact.service';

declare let _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'contact-search-form.component.html',
})

export class ContactSearchFormComponent {
  /*result: any;
  groups: any;
  constants: any;
  searchText: any;
  suggestions: any;
  active: boolean;
  contactUrl: string = Constants.urls.contacts;

  suggest$: Observable<any>;

  constructor(public serviceManager: ServiceManager,
              // public contactService: ZContactService
  ) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.contactActive;
    // this.suggest$ = this.contactService.suggest$;
  }

  showSearchAdvanced() {

  }

  onSubmit(values: any) {
    console.log(values);
  }

  ngOnInit() {

  }

  getSuggestions(e: any) {
    // this.contactService.suggestContacts(this.searchText);

    console.log('inside Contact getSuggestion.', this.searchText);
  }

  onSelect(e: any) {
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
    this.serviceManager.getCommonEventService().broadcast({
      action: 'contact:contact:search',
      payload: {search_value: this.searchText}
    });
  }*/

  constants: any;
  suggestions: any = [];
  active: boolean;
  show: boolean = false;
  search: string;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.contactActive;
  }

  onEnter(e: any) {
    e.preventDefault();

    this.show = false;
    this.serviceManager.getCommonEventService().broadcast({
      action: 'contact:contact:search',
      payload: {search_value: this.search}
    });
  }

  onKey(e: any) {
    console.log(e);
    if (!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    /*this.serviceManager.getApi().post(`zone/social_network/search`, {
      q: `${this.search}`,
      types: ['member', 'community']
    }).subscribe(
      (res: any) => {
        this.suggestions.length = 0;
        console.log(res);
        if (res.data.communities || res.data.members) {
          this.suggestions = _.concat(res.data['members'], res.data['communities']);
        }
      }
    );*/
  }

  onNavigation(data: any) {
    this.show = false;

    if (data.user_name) {
      this.serviceManager.getRouter().navigate([`/profile/${data.uuid}`]);
    } else if (data.admin) {
      this.serviceManager.getRouter().navigate([`/communities/${data.uuid}`]);
    }
  }

}
