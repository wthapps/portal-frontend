import { Pipe, PipeTransform } from '@angular/core';
import { WTHEmojiService } from '@wth/shared/components/emoji/emoji.service';
import { WTHEmojiCateCode } from '@wth/shared/components/emoji/emoji';

@Pipe({
  name: 'wth2Emojis'
})
export class WTHEmojiPipe implements PipeTransform {
  private map: {[name: string]: WTHEmojiCateCode} = {};

  constructor(public wthEmojiService: WTHEmojiService) {
    this.wthEmojiService.name2baseCodeMap$.subscribe((map) => {
      this.map = map
    });
  }

  transform(value: string) {
    return value.replace(this.wthEmojiService.PARSE_REGEX, this.replacer.bind(this));
  }

  private replacer(str, offset, s) {
    if(Object.keys(this.map).length == 0 ) {
      return str;
    }  else
      return `<i class="emojione-40-${this.map[str].category} _${this.map[str].code} ng-star-inserted"></i>` || str;
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
