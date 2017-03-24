import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { HdModalComponent } from '../../../core/shared/ng2-hd/modal/components/modal';
import { ListComponent } from '../../../core/shared/ng2-hd/list/components/list.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
// import { ApiBaseService, UserService } from '../../../../shared/index';

// import { HdModalComponent } from '../../../shared/ng2-hd/modal/components/modal';
// import { ListComponent } from '../../../shared/ng2-hd/list/components/list.component';


declare var _: any;

export const SELECT_TYPE: any = {
  memberInvite: { type: 'member-invite', title: 'Invite members', titleIcon: 'fa fa-user-plus'},
  friendShare: { type: 'friend-share', title: 'Share with friends', titleIcon: 'fa fa-share-alt'}
};

export const MODE_TYPE: any = {
  add: 'add',
  edit: 'edit'
};

@Component({
  moduleId: module.id,
  selector: 'member-list-invite',
  templateUrl: 'member-list-invite.component.html',
  styleUrls: ['member-list-invite.component.css']
})

export class MemberListInviteComponent {
  @ViewChild('modal') modal: HdModalComponent;
  @ViewChild('list') list: ListComponent;

  readonly title: string = SELECT_TYPE.memberInvite.title;
  readonly titleIcon: string = SELECT_TYPE.memberInvite.titleIcon;
  readonly type: string = SELECT_TYPE.memberInvite.type;
  mode: string = MODE_TYPE.add;

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  items: Array<any> = new Array<any>();
  itemNames: Array<any> = new Array<any>();
  selectedItems: Array<any> = new Array<any>();
  url: string = undefined;

  constructor(private apiService: ApiBaseService) {

  }

  open(options: any = {url: undefined, mode: 'add'}) {
    if (options.url != undefined) {
      this.url = options.url;
    }

    // Clear selected items
    if (options.mode === MODE_TYPE.add)
      this.selectedItems.length = 0;

    this.list.setInputValue('');
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


  loadData(search_name: string = ''): void {
    let body = {'search_name': search_name};
    this.apiService.get(this.url, body)
      .subscribe((res: any) => {
          if (this.selectedItems.length === 0 ) {
            this.items = res['data'];
            this.items.unshift(...this.selectedItems);
          } else {
            // TODO: shorten the syntax ???
            this.items.length = 0;
            this.items.push(...this.selectedItems);

            for(let i = 0; i < this.items.length; i++ ) {
              this.items[i].selected = true;
            }

            for(let j = 0; j < res['data'].length; j++) {
              var match = false;
              for(let i = 0; i < this.selectedItems.length; i++ ) {
                if (this.items[i].uuid === res['data'][j].uuid) {
                  match = true;
                  break;
                }
              }
              if (!match)
                this.items.push(res['data'][j]);
            }
          }

          this.itemNames = _.map(res['data'], 'name');
        },
        error => {
          console.log('error', error);
        });
  }

  loadSuggestList(input: string): void {

  }

  // updateUserList(items: any): void {
  //   this.items = items;
  // }
}
