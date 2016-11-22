import { Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges,
  EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../shared/ng2-hd/modal/hd-modal.module';
import { ApiBaseService, UserService, LoadingService } from '../../../shared/index';
import { SoPost } from '../../../shared/models/social_network/so-post.model';
import { PostPhotoSelectComponent } from './post-photo-select.component';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from '../../../shared/index';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-share-friend',
  templateUrl: 'post-share-friend.component.html'
})

export class PostShareFriendComponent implements OnInit{
  @ViewChild('modal') modal: HdModalComponent;

  friends: Array<any> = new Array<any>();
  selectedItems: Array<any> = new Array<any>();

  constructor(private apiService: ApiBaseService, private userService: UserService) {

  }

  ngOnInit(): void {

  }

  addItem(item: any) {

  }

  removeItem(item: any) {

  }

  onSelectedItems(items: any) {
    console.log('selected items', items);
    this.selectedItems = items;
  }

  selectItems(event: any) {
    console.log('select item', this.selectedItems);
  }

  loadData(): void {
    console.log('loading data');// load tags
    this.apiService.get(`zone/social_network/users/${this.userService.profile.uuid}`)
      .subscribe((result: any) => {
          this.friends = result['data']['friends'];
        },
        error => {
          console.log('error', error);
        });
  }
}
