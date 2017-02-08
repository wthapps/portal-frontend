import { Injectable }     from '@angular/core';
import { UserService } from '../services/user.service';

declare var _: any;

@Injectable()
export class StorageService {
  listItem: Array<StorageItem> = [];
  storageId: any;

  constructor(public userService: UserService) {
    this.storageId = userService.profile.id;
    console.log('storageId', this.storageId);
  }

  save(key: string, value: any) {
    // Convert StorageItem if need
    if (value instanceof StorageItem) {
      value = value.value;
    }

    // Replace old value by new
    let n = true;
    _.forEach(this.listItem, (i: any) => {
      if (i.key == key) {
        i.value = value;
        n = false;
      }
    });

    // Create new store if need
    if (n) {
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
    for (let item of this.listItem) {
      if (item.key == key) return item;
    }
    return null;
  }

  verifyStorage() {
    // if()
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


