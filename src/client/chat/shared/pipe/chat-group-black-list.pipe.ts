import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatGroupBlackList'})
export class ChatGroupBlackListPipe implements PipeTransform {

  transform(items: any[], args: any[]) {
    return items.filter(item => item.black_list == true);
  }
}

