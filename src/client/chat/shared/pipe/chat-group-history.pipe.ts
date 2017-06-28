import { Pipe, PipeTransform } from '@angular/core';

declare var _: any;

@Pipe({name: 'chatGroupHistory'})
export class ChatGroupHistoryPipe implements PipeTransform {
  transform(items: any, detectChange: any) {
    // return items.filter(item => item.history == true);
    // console.log(items);
    // console.log(_.filter(items['data'], ['history', true]));
    return _.filter(items['data'], ['history', true]);
  }
}

