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
  shares: Array<any>;

  constructor(private api: ApiBaseService) {}

  open(options: any = {item: undefined}) {
    this.modal.open();

    this.api.get(`zone/social_network/posts/list_shares`).subscribe(
      (response: any) => {
        this.shares = response['data'];
      }
    )





  }
}
