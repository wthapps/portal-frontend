import {
  Component,
  OnInit,
} from '@angular/core';

import { Constants } from '../../../shared/constant/config/constants';
import { Router, ActivatedRoute } from '@angular/router';

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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.activeTabs = { ...DEFAULT_TABS, 'mine': true };
    this.route.params.subscribe(params => {
      this.activeTabs = {...DEFAULT_TABS, [params.id || 'mine']: true };
    });
  }

  search(e: any, data: any) {
    this.router.navigate([`search/${data}`, { q: this.route.snapshot.params['q'] }]);
  }
}
