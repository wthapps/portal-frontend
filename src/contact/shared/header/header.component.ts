import { Component, ViewChild, OnDestroy } from '@angular/core';


import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { TextBoxSearchComponent } from '../../../shared/partials/search-box/textbox-search.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiBaseService, UrlService } from '@shared/services';
import { ZContactService } from '@contacts/shared/services/contact.service';

declare var _: any;
const DEBOUNCE_TIME = 500;

/**
 * This class represents the navigation bar component.
 */
@Component({

  selector: 'contact-shared-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.scss'],
})
export class ZContactSharedHeaderComponent implements OnDestroy {
  constants: any;
  suggestions: any[] = [];
  show = false;
  search: string;
  text: string;
  searchAdvanced = false;
  @ViewChild('textbox') textbox: TextBoxSearchComponent;
  private suggestSubject: Subject<any> = new Subject<any>();
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(public router: Router,
              public route: ActivatedRoute,
              public urlService: UrlService,
              public contactService: ZContactService,
              public apiBaseService: ApiBaseService) {
    if (this.urlService.parse().id) {
      this.text = this.urlService.parse().id.split('q=')[1];
    }

    this.suggestSubject.pipe(
      debounceTime(DEBOUNCE_TIME),
      takeUntil(this.destroySubject)
    ).subscribe(key => {
      this.suggestions = this.contactService.searchContact(key);
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  clickedInside($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();  // <- that will stop propagation on lower layers
  }

  onEscape() {
    this.show = false;
    this.search = '';
    this.onEnter(this.search);
  }

  onEnter(search: any) {
    this.show = false;
    this.search = search;
    const url = this.router.url;
    if (url.startsWith('/search')) {
      const routeUrl = this.urlService.parseRoute(url);
      this.router.navigate([routeUrl, {q: this.search}]);
    } else {
      this.router.navigate(['search', {q: this.search}]);
    }
  }

  onKey(search: any) {
    if (!search) {
      this.show = false;
      return;
    }
    this.show = true;
    this.search = search;
    this.suggestSubject.next(search);
  }

  onNavigation(data: any) {
    this.show = false;
    this.router.navigate([`/contacts/${data.id}`, { mode: 'view' }]);
    // // if contact
    // if (data.user_id) {
    //   this.router.navigate([`/contacts/${data.id}`, {mode: 'view'}]);
    // } else {
    //   // else users
    //   this.router.navigate([`/contacts/${data.id}`]);
    // }
  }

  onSearchAdvanced(e: any) {
    this.searchAdvanced = e.searchAdvanced;
  }
}
