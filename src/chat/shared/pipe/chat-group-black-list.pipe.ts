import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'chatGroupBlackList' })
export class ChatGroupBlackListPipe implements PipeTransform {
  transform(items: any[], detectChange: any) {
    return items.filter(item => item.blacklist == true);
  }
}
