import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WTHEmoji, WTHEmojiCateCode } from '@shared/components/emoji/emoji';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

declare let _: any;

export const iconSize: number = 40;

@Injectable()
export class WTHEmojiService {
  EMOJI_DB: any = [];
  readonly PARSE_REGEX = /:([a-zA-Z0-9_\-\+]+):/g;

  showEmoji$: Observable<any>;
  selectedEmoji$: Observable<any>;
  name2baseCodeMap$: Observable<{[name: string]: WTHEmojiCateCode}>;

  private showEmojiSubject: Subject<any> = new Subject<any>();

  private selectedEmojiSubject: Subject<WTHEmoji> = new Subject<WTHEmoji>();
  private name2baseCodeSubject: BehaviorSubject<{[name: string]: WTHEmojiCateCode}> = new BehaviorSubject({});

  constructor(private http: HttpClient) {
    this.showEmoji$ = this.showEmojiSubject.asObservable();
    this.selectedEmoji$ = this.selectedEmojiSubject.asObservable();
    this.name2baseCodeMap$ = this.name2baseCodeSubject.asObservable();

    this.mapName2BaseCode();
  }

  mapName2BaseCode(): Promise<{[name: string]: WTHEmojiCateCode}> {
    return this.http
      .get('/assets/data/emoji.json')
      .toPromise()
      .then(data => {
        let name2Code: {[name: string]: WTHEmojiCateCode} = {};
        Object.entries(data).forEach(([k, v]) => {
          name2Code[v.shortname] = {category: v.category, code: k, diversity: v.diversity};
        });
        this.name2baseCodeSubject.next(name2Code);
        return name2Code;
      });
  }

  // get(emoji) {
  //   // TODO Fix performance
  //   for (let data of this.EMOJI_DB) {
  //     for (let e of data.aliases) {
  //       if (emoji === e) {
  //         return data.emoji;
  //       }
  //     }
  //   }
  //   return emoji;
  // }

  getAll() {
    return this.http.get('/assets/data/emoji.json').pipe(map(data => Object.values(data)));
  }

  getByCat() {
    return this.http
      .get('/assets/data/emoji.json')
      .pipe(
        map(data => Object.values(data)),
        map(data => _.orderBy(data, ['order'], ['asc'])),
        map(data => _.groupBy(data, 'category'))
      );
  }

  // emojify(str) {
  //   return str
  //     .split(this.PARSE_REGEX)
  //     .map((emoji, index) => {
  //       // Return every second element as an emoji
  //       if (index % 2 === 0) {
  //         return emoji;
  //       }
  //       return this.get(emoji);
  //     })
  //     .join('');
  // }

  setEmoji(emoji: WTHEmoji) {
    this.selectedEmojiSubject.next(emoji);
  }

  show(event: any) {
    this.showEmojiSubject.next(event);
  }

  // getCurrentStatus(): boolean {
  //   return this.showEmojiSubject.getValue();
  // }

  hide() {
    this.showEmojiSubject.next(false);
  }
}
