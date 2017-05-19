import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatGroupSentRquest'})
export class ChatGroupSentRequestPipe implements PipeTransform {

  transform(items: any[]) {
    return items.filter(item => item.status == "sent_request");
  }
}

