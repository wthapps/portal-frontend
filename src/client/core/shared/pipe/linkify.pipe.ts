import { Pipe, PipeTransform } from '@angular/core';
declare let linkifyHtml:any;
//
@Pipe({name: 'linkify'})
export class LinkifyPipe implements PipeTransform {
  transform(str: string) {
    if(!str) {
      return '';
    }
    return linkifyHtml(str, {
      defaultProtocol: 'https'
    });
  }
}
