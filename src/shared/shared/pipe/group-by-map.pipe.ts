/**
 * by trungnghia112
 *
 <div *ngFor="let item of list | groupByMap:'group_by':'asc':'first_name':'asc'">
 <span>{{ item.key }}</span>
 <ul>
 <li *ngFor="let obj of item.value">
 </li>
 </ul>
 </div>
 */

import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  name: 'groupByMap'
})
export class GroupByMapPipe implements PipeTransform {

  transform(value: any, objectKey?: any, orderBy?: string, objectKeyIn?: any, orderByIn?: string): any {
    const result = _.chain(value)
      .groupBy(objectKey)
      .map((v, k) => {
        if (objectKeyIn) {
          return {key: k, value: _.orderBy(v, [objectKeyIn], [orderByIn])};
        } else {
          return {key: k, value: v};
        }
      })
      .value();
    if (result[0] && (result[0].key === 'photo' || result[0].key === 'album')) {
      return _.orderBy(result, ['key'], ['asc']);
    } else {
      return _.orderBy(result, ['key'], [orderBy]);
    }
  }

}
