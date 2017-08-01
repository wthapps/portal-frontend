import { Pipe, PipeTransform } from '@angular/core';

declare let _: any;

@Pipe({name: 'contactHasLabel'})
export class ZContactHasLabel implements PipeTransform {
  transform(contact: any, name:any) {
    if (_.some(contact.labels, {name: name}) == false){
      return false;
    }
    return true;
  }
}
