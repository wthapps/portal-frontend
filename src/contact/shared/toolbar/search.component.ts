import { Component, OnInit } from '@angular/core';

import { Constants } from '@shared/constant/config/constants';
import { ActivatedRoute, Router } from '@angular/router';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';

@Component({
  selector: 'z-contact-search-shared-toolbar',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class ZContactSearchSharedToolbarComponent implements OnInit {
  // active: any = [true, false, false];
  readonly tooltip: any = Constants.tooltip;
  tabs: WTab[];
  currentTab: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    const tabsInit: any = [
      {
        name: 'My Contacts',
        link: 'mine',
        icon: null,
        number: null,
        type: 'tab'
      },
      {
        name: 'Other Contacts',
        link: 'others',
        icon: null,
        number: null,
        type: 'tab'
      },
      {
        name: 'WTH!Apps',
        link: 'wth',
        icon: 'fa fa-info-circle',
        number: null,
        type: 'tab',
        tooltip: this.tooltip.wthContacts
      }
    ];
    this.tabs = tabsInit;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentTab = params.id;
    });
  }

  search(event: WTab) {
    this.router.navigate([
      `search/${event.link}`,
      { q: this.route.snapshot.params['q'] }
    ]);
  }
}
