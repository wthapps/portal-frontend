import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatUserOnline'})
export class ChatUserOnlinePipe implements PipeTransform {

  transform(items: any[], args: any, dectectChange:any) {
    return items.filter((item:any) => {
        return args.value.indexOf(item.display.id) != -1;
    });
  }
}

