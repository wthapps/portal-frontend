import { Component, ViewChild, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { HdModalComponent } from '../../../core/shared/ng2-hd/modal/components/modal';
import { ListComponent } from '../../../core/shared/ng2-hd/list/components/list.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';


declare var _: any;

export const ENTITY_TYPE = {
  memberInvite: 'member_invite',
  customFriend: 'custom_friend',
  customCommunity: 'custom_community'
}


export const ENTITY_ATTRS: any = [
  { type: ENTITY_TYPE.memberInvite, title: 'Invite members', titleIcon: 'fa fa-user-plus', defaultUrl: ''}, //
  { type: ENTITY_TYPE.customFriend, title: 'Share with friends', titleIcon: 'fa fa-share-alt', defaultUrl: 'zone/social_network/users_search/get_friend_list'},
  { type: ENTITY_TYPE.customCommunity, title: 'Share in communities', titleIcon: 'fa fa-share-alt', defaultUrl: 'zone/social_network/users_search/get_community_list'}];


export const MODE_TYPE: any = {
  add: 'add',
  edit: 'edit'
};

@Component({
  moduleId: module.id,
  selector: 'entity-select',
  templateUrl: 'entity-select.component.html',
  styleUrls: ['entity-select.component.css']
})

export class EntitySelectComponent implements OnInit {
  @ViewChild('modal') modal: HdModalComponent;
  @ViewChild('list') list: ListComponent;

  @Input() type: string;
  @Input() mode: string = MODE_TYPE.add;
  titleIcon: string;
  title: string

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  items: Array<any> = new Array<any>();
  itemNames: Array<any> = new Array<any>();
  selectedItems: Array<any> = new Array<any>();
  url: string = undefined;

  constructor(private apiService: ApiBaseService) {

  }

  ngOnInit() {
    this.changeEntity();
  }

  changeEntity(newType: string = ''){
    if (newType) {
      this.type = newType;
    }
    let entity = _.filter(ENTITY_ATTRS, {type: this.type});
    this.title = entity[0].title;
    this.titleIcon = entity[0].titleIcon;
    this.url = entity[0].defaultUrl;
  }

  open(options: any = {url: undefined, mode: 'add', type: ''}) {
    if (options.type != undefined)
      this.changeEntity(options.type);

    if (options.url != undefined) {
      this.url = options.url;
    }

    // Clear selected items
    if (options.mode == MODE_TYPE.add) {
      this.selectedItems.length = 0;
    }

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
      type: this.type,
      items: this.selectedItems
    });

    this.modal.close();
  }

  filterData(search_name: string = ''): void {

  }


  loadData(search_name: string = ''): void {
    let body = {'search_name': search_name};
    this.apiService.get(this.url, body)
      .subscribe((res: any) => {
          let data: any = res['data'];
          // switch (this.type) {
          //   case ENTITY_TYPE.memberInvite:
          //     data = res['data'];
          //     break;
          //   case ENTITY_TYPE.customFriend:
          //     data = res['data']['friends'];
          //     break;
          //   case ENTITY_TYPE.customCommunity:
          //     data = res['data']['communities'];
          //     break;
          //
          //   default: {
          //     console.error('Uninitialize or unsupported type: ', this.type);
          //     break;
          //   }
          // }




          if (this.selectedItems.length === 0 ) {
            this.items = data;
            // this.items.unshift(...this.selectedItems);
          } else {
            // TODO: shorten the syntax ???
            this.items.length = 0;
            this.items.push(...this.selectedItems);

            for(let i = 0; i < this.items.length; i++ ) {
              this.items[i].selected = true;
            }

            for(let j = 0; j < data.length; j++) {
              var match = false;
              for(let i = 0; i < this.selectedItems.length; i++ ) {
                if (this.items[i].uuid === data[j].uuid) {
                  match = true;
                  break;
                }
              }
              if (!match)
                this.items.push(data[j]);
            }
          }

          this.itemNames = _.map(data, 'name');
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
