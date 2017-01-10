import { Injectable }     from '@angular/core';

declare var _:any;

@Injectable()
export class StorageService {
  listItem: Array<StorageItem> = []

  save(key:string, value:any) {
    let item = new StorageItem(key, value);
    _.remove(this.listItem, (i) => {
      return i.key == item.key;
    });
    this.listItem.push(item);
  }

  get(key:string) {
    let item = this.find(key);
    if(item != undefined) return item.value;
    return null;
  }

  find(key:string) {
    for (let item of this.listItem) {
      if(item.key == key) return item
    }
    return null;
  }

  getList() {
    return this.listItem;
  }
}


class StorageItem {
  key:string;
  value:any;

  constructor(key:string, value:any) {
    this.key = key;
    this.value = value;
  }
}


