import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'filterBy'})
export class FilterByPipe implements PipeTransform {
  transform(collection: Object[], term: string, filter:string) {
    // console.log(filter);
    if (filter) {
      let keyVal:any;
      let filterArray:any;
      let arr:any = [];
      for (let i = 0; i < collection.length; i++) {
        keyVal = this.deepFind(collection[i], term);
        keyVal = keyVal.toLowerCase();
        filter = filter.toLowerCase();
        if (keyVal.indexOf(filter) !== -1) {
          arr.push(collection[i])
        }
      }
      return arr;
    }
    return collection;
  }

  private deepFind(obj: any, path: any) {
    let paths = path.toString().split(/[\.\[\]]/);
    let current = obj;

    for (let i = 0; i < paths.length; ++i) {
      if (paths[i] !== '') {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
    }
    return current;

  }
}

