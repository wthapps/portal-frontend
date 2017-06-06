import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatGroupPending'})
export class ChatGroupPendingPipe implements PipeTransform {

  transform(items: any[], detectChange:any) {
    return items.filter(item => item.status == 'pending');
  }
}

