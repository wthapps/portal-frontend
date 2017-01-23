import { Pipe, PipeTransform } from '@angular/core';
import { ZChatEmojiService } from './emoji.service';

declare var _: any;

@Pipe({
  name: 'wthEmojis'
})
export class ZChatEmojiPipe implements PipeTransform {
  transform(value: string, args: any[]) {
    value = value + ''; // make sure it's a string
    return value.replace(ZChatEmojiService.emojisRegex, (match, text)=> {
      return '<i class=\'wth-emoji wth-emoji-' + text + '\' title=\':' + text + ':\'></i>';
    });
  }
}
