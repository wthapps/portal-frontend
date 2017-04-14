import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'groupByObjectType'})
export class GroupByObjectTypePipe implements PipeTransform {
  transform(collection: Array<any>) {
    let newValue = Array<any>();
    for (let i = 0; i < collection.length; i++) {
      let keyVal = collection[i]['object_type'] ? collection[i]['object_type'] : 'N/A';
      let index = newValue.findIndex(myObj => myObj.key == keyVal);
      if (index >= 0) {
        newValue[index].value.push(collection[i]);
      } else {
        newValue.push({key: keyVal, value: [collection[i]]});
      }
    }

    console.log('new value after group by object type: ', newValue);
    return newValue;

  }
}

