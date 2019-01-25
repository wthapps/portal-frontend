import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'chatGroupRecent' })
export class ChatGroupRecentPipe implements PipeTransform {
  transform(items: any[], detectChange: any) {
    if (!items) return [];
    return items.filter(
      item => !item.favorite && !item.blacklist && !item.deleted && !item.left
    );
  }
}
