import { Component, ViewChild } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import { WthAppsBaseModal } from '@wth/shared/shared/interfaces/wthapps-base-modal';
import { HdModalComponent } from '@wth/shared/shared/ng2-hd';
import { ApiBaseService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';



@Component({

  selector: 'post-activities',
  templateUrl: 'post-activities.component.html'
})

export class PostActivitiesComponent implements WthAppsBaseModal {
  @ViewChild('modal') modal: HdModalComponent;

  event: any;
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

  close(options?: any) {

  }
}
