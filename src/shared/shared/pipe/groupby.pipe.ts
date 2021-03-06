import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
  transform(collection: Object[] = [], term: string = "") {
    if (!term || term == '') {
      return collection;
    }
    if (!collection || collection.length == 0) {

      return collection;
    }
    let newValue = Array<any>();

    for (let i = 0; i < collection.length; i++) {
      let keyVal = this.deepFind(collection[i], term);
      let index = newValue.findIndex(myObj => myObj.key == keyVal);
      if (index >= 0) {
        newValue[index].value.push(collection[i]);
      } else {
        newValue.push({key: keyVal, value: [collection[i]]});
      }
    }
    return newValue;
  }

  private deepFind(obj: any, path: any) {

    var paths = path.toString().split(/[\.\[\]]/);
    var current = obj;

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
