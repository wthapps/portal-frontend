import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ChatEditorService {
  private itemSaySource = new Subject<string>();

  listeningFromItem$ = this.itemSaySource.asObservable();

  itemSay(message: string) {
    this.itemSaySource.next(message);
  }
}
