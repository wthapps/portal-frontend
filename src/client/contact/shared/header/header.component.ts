import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TextBoxSearchComponent } from '../../../core/shared/components/header/search/components/textbox-search.component';
import { ServiceManager } from '../../../core/shared/services/service-manager';
import { SuggestionService } from '../../../core/shared/services/suggestion.service';

declare var _:any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'contact-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css'],
})
export class ZContactSharedHeaderComponent {
  constants: any;
  suggestions: any[] = [];
  show: boolean = false;
  search: string;
  suggest$: Observable<any>;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;

  constructor(public serviceManager: ServiceManager,
              public suggestService: SuggestionService) {
    this.suggestService.suggest$.subscribe((suggestions: any[]) => {
      this.suggestions.length = 0;
      this.suggestions.push(...suggestions);
      console.log('suggestions received: ', this.suggestions);
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
