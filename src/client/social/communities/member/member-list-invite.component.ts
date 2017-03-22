import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../../core/shared/ng2-hd/modal/components/modal';
import { ListComponent } from '../../../core/shared/ng2-hd/list/components/list.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
// import { ApiBaseService, UserService } from '../../../../shared/index';

// import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';
// import { ListComponent } from '../../../shared/ng2-hd/list/components/list.component';


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

  open(options: any = {url: undefined}) {
    if (options.url != undefined) {
      this.url = options.url;
    }

    // Clear selected items
    this.selectedItems.length = 0;
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

  cancel($event: any) {
    if (this.selectedItems.length > 0) {
      this.selectedItems = [];
      this.modal.dismiss();
      // this.list.resetSelectedItems();
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

  searchMembers(): void {
    console.log('search keyword: ', this.list);

    // this.apiService.get(this.url)
    //   .subscribe((result: any) => {
    //       this.items = result['data'];
    //       this.itemNames = _.map(result['data'], 'name');
    //     },
    //     error => {
    //       console.log('error', error);
    //     });
  }
}
