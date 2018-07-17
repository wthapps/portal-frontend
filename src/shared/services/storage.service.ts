import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { UserService } from './user.service';
import {
  CHAT_CONVERSATIONS, CHAT_RECENT_CONVERSATIONS, CHAT_FAVOURITE_CONVERSATIONS,
  CHAT_HISTORY_CONVERSATIONS, CONVERSATION_SELECT, CURRENT_CHAT_MESSAGES, USERS_ONLINE, NUMBER_MESSAGE
} from '@wth/shared/constant';
import { Observable } from 'rxjs';
import { empty } from 'rxjs/observable/empty';

declare var _: any;

const DEFAULT_STORAGES: {[name: string]: BehaviorSubject<any>} = {
  [CHAT_CONVERSATIONS]: new BehaviorSubject(null),
  [CHAT_RECENT_CONVERSATIONS]: new BehaviorSubject(null),
  [CHAT_FAVOURITE_CONVERSATIONS]: new BehaviorSubject(null),
  [CHAT_HISTORY_CONVERSATIONS]: new BehaviorSubject(null),
  [CONVERSATION_SELECT]: new BehaviorSubject(null),
  [CURRENT_CHAT_MESSAGES]: new BehaviorSubject(null),
  [USERS_ONLINE]: new BehaviorSubject([]),
  [NUMBER_MESSAGE]: new BehaviorSubject(20)
};

@Injectable()
export class StorageService {
  // listItem: Array<StorageItem> = [];
  private listItem: {[name: string]: any} = DEFAULT_STORAGES;
  storageId: any;
  reset: boolean = true;

  constructor(public userService: UserService) {
    if (userService && userService.getSyncProfile()) {
      this.storageId = userService.getSyncProfile().id;
    }
  }

  save(key: string, value: any): void {
    // // Convert StorageItem if need
    // if (value instanceof StorageItem) {
    //   value = _.clone(value).value;
    // }
    // // Create new store if need
    // let item = this.find(key);
    // if (item) {
    //   item.value = _.clone(value);
    // } else {
    //   this.saveNew(key, value);
    // }

    const newVal = _.cloneDeep(value);
    this.listItem[key] ? this.listItem[key].next(newVal) : this.listItem[key] = new BehaviorSubject(newVal);
  }

  removeItemOfKey(key: string, item: any): void {
    let value: any = this.get(key);
    if(Array.isArray(value)) {
      value = value.filter(i => i.id !== item.id);
      this.save(key, value);
    }
  }

  updateItemOfKey(key: string, item: any): void {
    let value: any = this.get(key);
    if(Array.isArray(value)) {
      value = value.map(i => (i.id !== item.id ? i : item));
      this.save(key, _.clone(value));
    }
  }

  saveNew(key: string, value: any): void {
    // let item = new StorageItem(key, _.clone(value));
    // _.remove(this.listItem, (i: any) => {
    //   return i.key == item.key;
    // });
    // this.listItem.push(item);
    const newVal = _.cloneDeep(value);
    this.listItem[key] ? this.listItem[key].next(newVal) : this.listItem[key] = new BehaviorSubject(newVal);
  }

  get(key: string) {
    // let item = this.find(key);
    // if (item != undefined) return item.value;
    // return null;

    return this.getValue(key);
  }

  getValue(key: string) {
    return this.listItem[key] ? this.listItem[key].getValue() : null;
  }

  getAsync(key: string): Observable<any> {
    return this.listItem[key] ? this.listItem[key].asObservable() : empty();
  }

  find(key: string): StorageItem {
    // this.resetIfNeed();
    // for (let item of this.listItem) {
    //   if (item.key == key) return item;
    // }
    // return null;

    return new StorageItem(key, this.getValue(key));
  }

  resetIfNeed() {
    if (
      this.storageId &&
      this.userService.getSyncProfile() &&
      this.storageId != this.userService.getSyncProfile().id &&
      this.reset
    ) {
      // for (let item of this.listItem) {
      //   item.value = null;
      // }
      this.listItem = {...DEFAULT_STORAGES};
      this.storageId = this.userService.getSyncProfile().id;
    }
  }

  // getList() {
  //   return this.listItem;
  // }
}

class StorageItem {
  key: string;
  value: any;

  constructor(key: string, value: any) {
    this.key = key;
    this.value = value;
  }

  save() {
    console.log('save');
  }
}
