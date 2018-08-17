import { Pipe, PipeTransform } from '@angular/core';
import { ZChatEmojiService } from './emoji.service';

declare var _: any;

@Pipe({
  name: 'wthEmojis'
})
export class ZChatEmojiPipe implements PipeTransform {
  transform(value: string) {
    value = value + ''; // make sure it's a string
    return value.replace(ZChatEmojiService.emojisRegex, (match, text) => {
      let text_class = '';
      if (text.charAt(0) === ';' || text.charAt(0) === ':') {
        text_class = text;
      } else {
        text_class = text.replace(/\(|\)/gi, '');
      }
      return '<i class=\'wth-emoji wth-emoji-' + text_class.replace(':', '') + '\' title=' + text + '></i>';
    });
  }
}

@Pipe({
  name: 'wthEmojisClass'
})
export class ZChatEmojiClassPipe implements PipeTransform {
  transform(value: string) {
    value = value + ''; // make sure it's a string
    value = value.replace(/\\/gi, '');
    if (value.charAt(0) === ';' || value.charAt(0) === ':') {
      value = value.replace(':', '');
    } else {
      value = value.replace(/\(|\)/gi, '');
    }
    return value;
  }
}
