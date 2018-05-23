import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'wthFilterBy'})
export class WthFilterByPipe implements PipeTransform {
  transform(collection: Object[], term:any, filter:any, detectChanges: any) {
    // console.log(filter);
    if (filter) {
      let keyVal: any;
      let arr: any = [];
      for (let i = 0; i < collection.length; i++) {
        keyVal = this.deepFind(collection[i], term);
        if (typeof keyVal.toLowerCase === "function") {
            // safe to use the function
            keyVal = keyVal.toLowerCase();
        }
        if (typeof filter.toLowerCase === "function") {
            // safe to use the function
            filter = filter.toLowerCase();
        }
        if (typeof keyVal.indexOf == "function" && keyVal.indexOf(filter) !== -1) {
          arr.push(collection[i]);
        } else if (keyVal == filter) {
          arr.push(collection[i]);
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
