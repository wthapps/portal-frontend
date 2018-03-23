import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WTHEmoji } from '@shared/components/emoji/emoji';

declare let _: any;

@Injectable()
export class WTHEmojiService {
  EMOJI_DB: any = [];
  PARSE_REGEX = /:([a-zA-Z0-9_\-\+]+):/g;

  showEmoji$: Observable<any>;
  selectedEmoji$: Observable<any>;

  private showEmojiSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  private selectedEmojiSubject: BehaviorSubject<WTHEmoji> = new BehaviorSubject<WTHEmoji>(
    null
  );

  constructor(private http: HttpClient) {
    this.showEmoji$ = this.showEmojiSubject.asObservable();
    this.selectedEmoji$ = this.selectedEmojiSubject.asObservable();
  }

  get(emoji) {
    // TODO Fix performance
    for (let data of this.EMOJI_DB) {
      for (let e of data.aliases) {
        if (emoji === e) {
          return data.emoji;
        }
      }
    }
    return emoji;
  }

  getAll() {
    return this.http
      .get('/assets/data/emoji.json')
      .map(data => Object.values(data));
  }

  getByCat() {
    return this.http
      .get('/assets/data/emoji.json')
      .map(data => Object.values(data))
      .map(data => _.orderBy(data, ['order'], ['asc']))
      .map(data => _.groupBy(data, 'category'));
  }

  emojify(str) {
    return str
      .split(this.PARSE_REGEX)
      .map((emoji, index) => {
        // Return every second element as an emoji
        if (index % 2 === 0) {
          return emoji;
        }
        return this.get(emoji);
      })
      .join('');
  }

  setEmoji(emoji: WTHEmoji) {
    this.selectedEmojiSubject.next(emoji);
  }

  show(event: any) {
    this.showEmojiSubject.next(event);
  }

  getCurrentStatus(): boolean {
    return this.showEmojiSubject.getValue();
  }

  hide() {
    this.showEmojiSubject.next(false);
  }
}
