import { Component, ViewChild } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/components/modal';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
// import { HdModalComponent } from '../../shared/ng2-hd/modal/index';
// import { ApiBaseService } from '../../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-activities',
  templateUrl: 'post-activities.component.html'
})

export class PostActivitiesComponent {
  @ViewChild('modal') modal: HdModalComponent;

  shares: Array<any> = new Array<any>();
  item: any = undefined;

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
      .subscribe((result: any) => {
          this.shares = result['data'];
        },
        error => {
          console.log('error', error);
        });
  }
}
