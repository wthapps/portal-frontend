import { Pipe, PipeTransform } from '@angular/core';
import { ZChatEmojiService } from './emoji.service';

@Pipe({
  name: 'wthEmojis'
})
export class ZChatEmojiPipe implements PipeTransform {
  transform(value: string, args: any[]) {
    value = value + ''; // make sure it's a string
    return value.replace(ZChatEmojiService.emojisRegex, (match, text)=> {
      let indexEmoji = ZChatEmojiService.emojis.indexOf(text) + 1;
      return "<i class=\"wth-emoji wth-emoji-" + indexEmoji + "\" title=\":" + text + ":\"></i>";
    });
  }
}
