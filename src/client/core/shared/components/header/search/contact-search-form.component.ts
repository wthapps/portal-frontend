import { Component, ViewChild } from '@angular/core';
import { ServiceManager } from '../../../services/service-manager';
import { Constants } from '../../../config/constants';
import { Observable } from 'rxjs/Observable';
import { TextBoxSearchComponent } from './components/textbox-search.component';
import { SuggestionService } from '../../../services/suggestion.service';
// import { ZContactService } from '../../../../../contact/shared/services/contact.service';

declare let _: any;

@Component({
  moduleId: module.id,
  templateUrl: 'contact-search-form.component.html',
})

export class ContactSearchFormComponent {
  constants: any;
  suggestions: any[] = [];
  active: boolean;
  show: boolean = false;
  search: string;
  suggest$: Observable<any>;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager,
              public suggestService: SuggestionService) {
    this.constants = this.serviceManager.getConstants();
    this.active = this.constants.search.config.contactActive;
    this.suggestService.suggest$.subscribe((suggestions: any[]) => {
      this.suggestions.length = 0;
      this.suggestions.push(...suggestions);
      console.log('suggestions received: ', this.suggestions, this.active);
    });
  }

  onEnter(e: any) {
    // e.preventDefault();

    this.show = false;
    this.serviceManager.getRouter().navigate(['/contacts', {search: this.search}]);

    // this.serviceManager.getCommonEventService().broadcast({
    //   channel:  Constants.contactEvents.common,
    //   action: 'contact:contact:search',
    //   payload: {search_value: this.search}
    // });
  }

  onEscape(e: any) {
    this.search = '';
    this.onEnter(e);
  }

  onKey(e: any) {
    console.log(e);
    if (!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    this.suggestService.setInput(this.search);

    // if(e.code = 'Enter') {
    //   this.onEnter(e);
    // }
    // if(e.code = 'Esc') {
    //   this.onEscape(e);
    // }
  }

  onNavigation(data: any) {
    this.show = false;

    this.serviceManager.getRouter().navigate([`/contacts/detail/${data.id}`]);
  }

  showAllResults(event?: any) {
    // this.serviceManager.getRouter().navigate(['/contacts', {search: this.search}]);
    this.onEnter(event);
  }

}
