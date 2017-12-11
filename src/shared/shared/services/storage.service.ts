import { Injectable }     from '@angular/core';
import { UserService } from './user.service';

declare var _: any;

@Injectable()
export class StorageService {
  listItem: Array<StorageItem> = [];
  storageId: any;
  reset: boolean = true;

  constructor(public userService: UserService) {
    if (userService && userService.profile) {
      this.storageId = userService.profile.id;
    }
  }

  save(key: string, value: any) {
    // Convert StorageItem if need
    if (value instanceof StorageItem) {
      value = value.value;
    }
    // Create new store if need
    let item = this.find(key);
    if (item) {
      item.value = value;
    } else {
      this.saveNew(key, value);
    }
  }

  saveNew(key: string, value: any) {
    let item = new StorageItem(key, value);
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
    if (this.storageId && this.storageId != this.userService.profile.id && this.reset) {
      for (let item of this.listItem) {
        item.value = null;
      }
      this.storageId = this.userService.profile.id;
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


