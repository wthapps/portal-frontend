import { Component, ViewChild } from '@angular/core';

import { WthAppsBaseModal } from '@wth/shared/shared/interfaces/wthapps-base-modal';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';

@Component({
  selector: 'post-activities',
  templateUrl: 'post-activities.component.html'
})

export class PostActivitiesComponent implements WthAppsBaseModal {
  @ViewChild('modal') modal: BsModalComponent;

  event: any;
  readonly tooltip: any = Constants.tooltip;

  shares: Array<any> = new Array<any>();
  item: any = undefined;
  type: any;

  constructor(private api: ApiBaseService) {
  }

  open(options: any = {item: undefined}) {
    this.modal.open();

    if (options.item) {
      this.item = options.item;
      this.loadData(this.item.uuid);
    }
  }

  loadData(uuid): void {
    this.api.post(`zone/social_network/posts/show_activities`, {post_id: uuid})
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
