import { Component, ViewChild, OnInit, Output,EventEmitter } from '@angular/core';
import { HdModalComponent, ListComponent } from '../../shared/ng2-hd/index';
import { ApiBaseService, UserService, LoadingService } from '../../../shared/index';
import { UserService } from '../../../shared/index';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'post-privacy-custom',
  templateUrl: 'post-privacy-custom.component.html'
})

export class PostPrivacyCustomComponent implements OnInit{
  @ViewChild('modal') modal: HdModalComponent;
  @ViewChild('list') list: ListComponent;

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();
  type: string;
  title: string;

  items: Array<any> = new Array<any>();
  itemNames: Array<any> = new Array<any>();
  selectedItems: Array<any> = new Array<any>();

  constructor(private apiService: ApiBaseService, private userService: UserService) {

  }

  ngOnInit(): void {

  }

  open(options: any = {type: 'customer_friend', searchItems: [], selectedItems: []}) {
    this.type = options.type;
    this.title = this.isCustomFriend() ? 'Share with Friends' : 'Share in Communities';
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
      type: this.type,
      items: this.selectedItems
    });
    this.modal.close();
  }

  cancel($event: any) {
    if (this.selectedItems.length > 0) {
      this.selectedItems = [];
      this.modal.dismiss();
    }
  }

  loadData(): void {
    this.apiService.get(`zone/social_network/users/${this.userService.profile.uuid}`)
      .subscribe((result: any) => {
        if (this.isCustomFriend()) {
          this.items = result['data']['friends'];
          this.itemNames = _.map(result['data']['friends'], 'name');
        } else {
            this.items = result['data']['communities'];
            this.itemNames = _.map(result['data']['communities'], 'name');
          }
        },
        error => {
          console.log('error', error);
        });
  }

  isCustomFriend () : boolean {
    return this.type == 'custom_friend';
  }
}