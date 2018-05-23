import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'wth2Emojis'
})
export class WTHEmojiPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

@Pipe({
  name: 'wth2EmojisClass'
})
export class WTHEmojiClassPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}
