import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatGroupMultiple'})
export class ChatGroupMultiplePipe implements PipeTransform {

  transform(items: any[]) {
    return items.filter(item => item.group_json.group_type == 'multiple');
  }
}

