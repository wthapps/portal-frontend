import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatGroupCouple'})
export class ChatGroupCouplePipe implements PipeTransform {

  transform(items: any[]) {
    return items.filter(item => item.group_json.group_type == 'couple' && item.black_list == false);
  }
}

