import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TextBoxSearchComponent } from '../../../shared/partials/search-box/textbox-search.component';
import { ServiceManager } from '../../../shared/services/service-manager';
import { SuggestionService } from '../../../shared/services/suggestion.service';

declare var _: any;

/**
 * This class represents the navigation bar component.
 */
@Component({

  selector: 'contact-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class ZContactSharedHeaderComponent {
  constants: any;
  suggestions: any[] = [];
  show: boolean = false;
  search: string;
  searchAdvanced: boolean = false;
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

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
    console.log('CLICKED INSIDE');
  }

  onEscape(e?: any) {
    console.log('inside onEscape', e);
    this.show = false;
    this.search = '';
    this.onEnter(e);
  }

  onEnter(e: any) {
    this.show = false;
    this.serviceManager.getRouter().navigate(['/contacts', {search: this.search}]);
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

  onSearchAdvanced(e: any) {
    console.log(e);
    this.searchAdvanced = e.searchAdvanced;
  }
}
