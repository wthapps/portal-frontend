import { Pipe, PipeTransform } from '@angular/core';
// import { linkify } from 'linkifyjs';
import * as linkifyHtml from 'linkifyjs/html';

@Pipe({name: 'linkify'})
export class LinkifyPipe implements PipeTransform {
  transform(str: string) {
    if (!str) {
      return '';
    }
    return linkifyHtml(str, {
      defaultProtocol: 'https'
    });
  }
}
