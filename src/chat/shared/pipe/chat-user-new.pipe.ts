import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'chatUserNew'})
export class ChatUserNewPipe implements PipeTransform {

  transform(items: any[], contacts: any) {
    let newContacts:any = [];
    if (contacts.value && items) {
      for(let i = 0; i < items.length; i++) {
        let add = true;
        for(let j = 0; j < contacts.value.data.length; j++) {
          if (contacts.value.data[j].display.id && items[i].id == contacts.value.data[j].display.id) {
            add = false;
          }
        }
        if (add) {
          newContacts.push(items[i]);
        }
      }

    }
    return newContacts;
  }
}

