import { Component, ViewChild } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { HdModalComponent } from '../../../core/shared/ng2-hd/modal/components/modal';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { BaseSocialModal } from './shared/modal/base-social-modal';
import { Constants } from '../../../core/shared/config/constants';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-activities',
  templateUrl: 'post-activities.component.html'
})

export class PostActivitiesComponent implements BaseSocialModal {
  @ViewChild('modal') modal: HdModalComponent;

  tooltip: any = Constants.tooltip;

  shares: Array<any> = new Array<any>();
  item: any = undefined;
  type: any;

  constructor(private api: ApiBaseService) {
  }

  open(options: any = {item: undefined}) {
    this.modal.open();

    if (options.item != undefined) {
      this.item = options.item;
    }
    this.loadData();
  }

  loadData(): void {

    this.api.post(`zone/social_network/posts/show_activities`, JSON.stringify({post_id: this.item.uuid}))
      .toPromise().then((result: any) => {
          this.shares = result['data'];
        },
        error => {
          console.log('error', error);
        });
  }

  close(body?: any) {

  }
}
