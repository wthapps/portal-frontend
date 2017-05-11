import { Component, ViewChild, Output, EventEmitter, OnInit, Input, OnDestroy } from '@angular/core';
import { ListComponent } from '../../../core/shared/ng2-hd/list/components/list.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Subject, Subscription } from 'rxjs';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import 'rxjs/operator/switchMap';


declare var _: any;

export const ENTITY_TYPE = {
  memberInvite: 'member_invite',
  customFriend: 'custom_friend',
  customCommunity: 'custom_community'
};


export const ENTITY_ATTRS: any = [
  { type: ENTITY_TYPE.memberInvite, title: 'Invite members', titleIcon: 'fa fa-user-plus', defaultUrl: ''}, //
  { type: ENTITY_TYPE.customFriend, title: 'Share with friends', titleIcon: 'fa fa-share-alt', defaultUrl: 'zone/social_network/users_search/get_friend_list'},
  { type: ENTITY_TYPE.customCommunity, title: 'Share in communities', titleIcon: 'fa fa-share-alt', defaultUrl: 'zone/social_network/users_search/get_community_list'}];


export const MODE_TYPE: any = {
  add: 'add',
  edit: 'edit'
};

export const DEBOUNCE_TIME: any = 250;

@Component({
  moduleId: module.id,
  selector: 'entity-select',
  templateUrl: 'entity-select.component.html',
  styleUrls: ['entity-select.component.css']
})

export class EntitySelectComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('list') list: ListComponent;

  @Input() type: string;
  @Input() mode: string = MODE_TYPE.add;
  titleIcon: string;
  title: string;

  @Output() onSelected: EventEmitter<any> = new EventEmitter<any>();

  items: Array<any> = new Array<any>();
  itemNames: Array<any> = new Array<any>();
  selectedItems: Array<any> = new Array<any>();
  url: string = undefined;
  term$ = new Subject<string>();

  termSubscription: Subscription;

  constructor(private apiService: ApiBaseService) {
  }

  resubscribe() {
    // if (this.termSubscription && !this.termSubscription.closed)
    //   this.term$.unsubscribe();
    this.termSubscription = this.term$
      .debounceTime(DEBOUNCE_TIME)
      .distinctUntilChanged()
      .switchMap(term => this.apiService.get(this.url,  {'search_name': (term == undefined ? '' : term)}) )
      .subscribe( (res: any) => {
          this.updateData(res['data']);
        }, (error : any)=> {
          console.log('error', error);
        }
      );
  }

  ngOnInit() {
    this.changeEntity();
  }

  ngOnDestroy() {
    if( this.termSubscription && !this.termSubscription.closed)
      this.termSubscription.unsubscribe();
  }

  changeEntity(newType: string = '') {
    if (newType && (this.type !== newType) ) {
      this.selectedItems.length = 0;
      this.type = newType;
    }
    let entity = _.filter(ENTITY_ATTRS, {type: this.type});
    this.title = entity[0].title;
    this.titleIcon = entity[0].titleIcon;
    this.url = entity[0].defaultUrl;

    // if (this.url)
    //   this.term$.next();
  }

  open(options: any = {url: undefined, type: ''},  mode: string = 'add') {
    if (options.type != undefined && options.type != '')
      this.changeEntity(options.type);

    this.items.length = 0;
    this.resubscribe();

    if (options.url != undefined && options.url != '') {
      this.url = options.url;
    }

    // Clear selected items
    if (mode == MODE_TYPE.add) {
      this.selectedItems.length = 0;
    }

    this.list.setInputValue('');
    this.modal.open()
      .then(() => {
        this.term$.next();}
      )
      .catch((error: any) => console.error('Cannot open entity select modal', error));
    // this.loadData();
  }


  addItem(item: any) {

  }

  removeItem(item: any) {
    _.remove(this.selectedItems, (i: any) => i.uuid === item.uuid);
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
    this.termSubscription.unsubscribe();
  }

  selectItems(event: any) {
    this.onSelected.emit({
      type: this.type,
      items: this.selectedItems
    });

    this.modal.close();
    this.termSubscription.unsubscribe();
  }

  private updateData(data: any) {
    if (this.selectedItems.length === 0 ) {
      this.items = data;
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
  }
}
