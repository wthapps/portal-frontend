import {
  Component,
  OnInit,
  HostBinding,
  ViewChild,
  Input
} from '@angular/core';
import { ZContactService } from '../services/contact.service';
import { ZContactShareImportContactComponent } from '../modal/import-contact/import-contact.component';
import { ICloudOAuthComponent } from '../modal/import-contact/icloud/icloud-oauth.component';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';

import { Constants } from '../../../shared/constant/config/constants';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlService } from '@shared/services';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-search-shared-toolbar',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class ZContactSearchSharedToolbarComponent implements OnInit {
  active: any = [true, false, false];
  tooltip: any = Constants.tooltip;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      switch(params.category) {
        case 'all':
        this.active = [true, false, false];
        break;
        case 'mine':
        this.active = [false, true, false];
        break;
        case 'wth':
        this.active = [false, false, true];
        break;
      }
    })
  }

  search(e: any, data: any) {
    this.route.params.take(1).subscribe(params => {
      this.router.navigate([`search/${data}`, {q: params['q'], category: data}]);
    });
  }
}
