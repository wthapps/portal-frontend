import { Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges,
  EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal.module';
import { ApiBaseService, LoadingService } from '../../../shared/index';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { PostPhotoSelectComponent } from './post-photo-select.component';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from '../../../shared/index';

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

  constructor(private api: ApiBaseService) {}

  open(options: any = {item: undefined}) {
    this.modal.open();

    if (options.item != undefined) {
      this.item = options.item;
    }
    this.loadData();
  }

  loadData(): void {

  this.api.post(`zone/social_network/posts/show_activities`, JSON.stringify({post_id:this.item.uuid}))
    .map(res => res.json())
    .subscribe((result: any) => {
        this.shares = result['data'];
      },
      error => {
        console.log('error', error);
      });
  }




  }
}
