import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'chatGroupMultiple' })
export class ChatGroupMultiplePipe implements PipeTransform {
  transform(items: any[], detectChange: any) {
    return items.filter(item => item.group.group_type == 'multiple');
  }
}
