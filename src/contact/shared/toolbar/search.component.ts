import {
  Component,
  OnInit,
} from '@angular/core';

import { Constants } from '../../../shared/constant/config/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { WTab } from '@shared/components/w-nav-tab/w-nav-tab';

const DEFAULT_TABS =  {
    mine: false,
    others: false,
    wth: false
  };
@Component({
  selector: 'z-contact-search-shared-toolbar',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class ZContactSearchSharedToolbarComponent implements OnInit {
  // active: any = [true, false, false];
  activeTabs: any = DEFAULT_TABS;
  readonly tooltip: any = Constants.tooltip;
  tabs: WTab[] = [{
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
      type: 'tab'
    }];
  currentTab: string;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.activeTabs = { ...DEFAULT_TABS, 'mine': true };
    this.route.params.subscribe(params => {
      this.activeTabs = {...DEFAULT_TABS, [params.id || 'mine']: true };
    });
  }

  search(event: WTab) {
    this.router.navigate([`search/${event.link}`, { q: this.route.snapshot.params['q'] }]);
  }
}
