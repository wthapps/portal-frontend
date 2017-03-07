import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatGroupName'})
export class ChatGroupNamePipe implements PipeTransform {

  transform(item: any, length: number) {
    if(item.name) {
      return item.name;
    }
    let name: string = item.users_json[0].name;
    for(let i:any=1; i < item.users_json.length; i++) {
      name = name + ', ' + item.users_json[i].name
    }
    if (name.length > length) {
      name = name.substring(0, length) + ' ...';
    }
    return name;
  }
}

