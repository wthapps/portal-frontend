import { Component, ViewChild, OnInit, Input, Output, OnChanges, SimpleChanges,
  EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../../shared/ng2-hd/modal/hd-modal.module';
import { ListComponent } from '../../../shared/ng2-hd/list/hd-list.module';
import { ApiBaseService, UserService, LoadingService } from '../../../../shared/index';
import { SoPost } from '../../../../shared/models/social_network/so-post.model';
import { PostPhotoSelectComponent } from '../../post/post-photo-select.component';
import { Validators, FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UserService } from '../../../../shared/index';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'member-list-invite',
  templateUrl: 'member-list-invite.component.html',
  styleUrls: ['member-list-invite.component.css']
})

export class MemberListInviteComponent {
  @ViewChild('modal') modal: HdModalComponent;
  @ViewChild('list') list: ListComponent;

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  items: Array<any> = new Array<any>();
  itemNames: Array<any> = new Array<any>();
  selectedItems: Array<any> = new Array<any>();
  url: string = undefined;

  constructor(private apiService: ApiBaseService, private userService: UserService) {

  }

  open(options:any = {url: undefined}) {
    if (options.url != undefined) {
      this.url = options.url;
    }
    this.modal.open();
    this.loadData();
  }



  addItem(item: any) {

  }

  removeItem(item: any) {

  }

  onSelectedItems(items: any) {
    this.selectedItems = items;
  }

  selectItems(event: any) {
    this.onSelected.emit({
      type: 'custom_community',
      items: this.selectedItems
    });

    this.modal.close();
  }

  cancel($event: any) {
    if (this.selectedItems.length > 0) {
      this.selectedItems = [];
      this.modal.dismiss();
      this.list.resetSelectedItems();
    }
  }

  selectItems(event: any) {
    this.onSelected.emit({
      type: 'invite_members',
      items: this.selectedItems
    });

    this.modal.close();
  }

  loadData(): void {
    this.apiService.get(this.url)
      .subscribe((result: any) => {
          this.items = result['data'];
          this.itemNames = _.map(result['data'], 'name');
        },
        error => {
          console.log('error', error);
        });
  }
}
