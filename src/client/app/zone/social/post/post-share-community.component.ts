import { Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges,
  EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal';
import { ApiBaseService, UserService, LoadingService } from '../../../shared/index';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { PostPhotoSelectComponent } from './post-photo-select.component';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from '../../../shared/index';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-share-community',
  templateUrl: 'post-share-community.component.html',
  styleUrls: ['post-share-community.component.css']
})

export class PostShareCommunityComponent {
  @ViewChild('modal') modal: HdModalComponent;

  communities: Array<any> = new Array<any>();
  communityNames: Array<any> = new Array<any>();

  constructor(private apiService: ApiBaseService, private userService: UserService) {

  }

  addCommunity(commnity: any) {

  }

  removeCommunity(community: any) {

  }

  loadData(): void {
    console.log('loading data');// load tags
    this.apiService.get(`zone/social_network/users/${this.userService.profile.uuid}`)
        .subscribe((result: any) => {
            this.communities = result['data']['communities'];
            this.communityNames = _.map(result['data']['communities'], 'name');
          },
          error => {
            console.log('error', error);
          });
  }
}
