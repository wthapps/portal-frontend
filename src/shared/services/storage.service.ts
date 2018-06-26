import { Injectable } from '@angular/core';
import { UserService } from './user.service';

declare var _: any;

@Injectable()
export class StorageService {
  listItem: Array<StorageItem> = [];
  storageId: any;
  reset: boolean = true;

  constructor(public userService: UserService) {
    if (userService && userService.getSyncProfile()) {
      this.storageId = userService.getSyncProfile().id;
    }
  }

  save(key: string, value: any) {
    // Convert StorageItem if need
    if (value instanceof StorageItem) {
      value = _.clone(value).value;
    }
    // Create new store if need
    let item = this.find(key);
    if (item) {
      item.value = _.clone(value);
    } else {
      this.saveNew(key, value);
    }
  }

  removeItemOfKey(key: string, item: any): void {
    let value: any = this.get(key);
    if(Array.isArray(value)) {
      value = value.filter(i => i.id !== item.id);
      this.save(key, value);
    }
  }

  updateItemOfKey(key: string, item: any) {
    let value: any = this.get(key);
    if(Array.isArray(value)) {
      value = value.map(i => (i.id !== item.id ? i : item));
      this.save(key, _.clone(value));
    }
  }

  saveNew(key: string, value: any) {
    let item = new StorageItem(key, _.clone(value));
    _.remove(this.listItem, (i: any) => {
      return i.key == item.key;
    });
    this.listItem.push(item);
  }

  get(key: string) {
    let item = this.find(key);
    if (item != undefined) return item.value;
    return null;
  }

  find(key: string) {
    this.resetIfNeed();
    for (let item of this.listItem) {
      if (item.key == key) return item;
    }
    return null;
  }

  resetIfNeed() {
    if (
      this.storageId &&
      this.userService.getSyncProfile() &&
      this.storageId != this.userService.getSyncProfile().id &&
      this.reset
    ) {
      for (let item of this.listItem) {
        item.value = null;
      }
      this.storageId = this.userService.getSyncProfile().id;
    }
  }

  getList() {
    return this.listItem;
  }
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
