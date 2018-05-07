import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TextBoxSearchComponent } from '../../../shared/partials/search-box/textbox-search.component';
import { ServiceManager } from '../../../shared/services/service-manager';
import { SuggestionService } from '../../../shared/services/suggestion.service';
import { Router } from '@angular/router';
import { ApiBaseService } from '@shared/services';

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

  constructor(public router: Router,
              public apiBaseService: ApiBaseService,
              public suggestService: SuggestionService) {
    this.suggestService.suggest$.subscribe((suggestions: any[]) => {
      this.suggestions.length = 0;
      this.suggestions.push(...suggestions);
      console.log('suggestions received: ', this.suggestions);
    });

    this.suggestService.input$.subscribe((input: any) => {
      this.apiBaseService.get(`contact/search/my_contacts`, {q: `name:${input}`, per_page: 5})
      .subscribe(res => {
        let items = res.data;
        this.suggestService.setSuggestion(items);
        this.apiBaseService.get(`contact/search/wth_users_suggest`, {q: `name:${input}`, per_page: 5})
        .subscribe(res => {
          // filter duplications
          let hash = {};
          const suggests = [...items, ...res.data].filter(item => {
            // if contact
            if (item.user_id) {
              if (hash[item.id]) return false;
              hash[item.id] = true; return true;
            }
            // else user
            return true;
          })
          this.suggestService.setSuggestion(suggests);
          // console.log(suggests);
          // console.log([...items, ...res.data]);
        });
      });
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
    this.router.navigate(['search/all', {q: this.search}]);
  }

  onKey(e: any) {
    if (!e.search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = e.search;
    this.suggestService.setInput(this.search);
  }

  onNavigation(data: any) {
    this.show = false;
    // if contact
    if (data.user_id) {
      this.router.navigate([`/contacts/detail/${data.id}`]);
    } else {
      // else users
      this.router.navigate([`/contacts/user_detail/${data.id}`]);
    }
  }

  onSearchAdvanced(e: any) {
    this.searchAdvanced = e.searchAdvanced;
  }
}
