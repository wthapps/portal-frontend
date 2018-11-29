import { Injectable } from '@angular/core';

import { Observable ,  Subject ,  BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiBaseService, BaseEntityService } from '@wth/shared/services';
import { _wu } from '@wth/shared/shared/utils/utils';
import { Contact } from '@contacts/contact/contact.model';
import { MaxLengthPipe } from '@shared/shared/pipe/max-length.pipe';

declare var _: any;
declare var Promise: any;
export const ITEM_PER_PAGE = 50;
export const OTHER_CONTACTS = 'others';
export const MY_CONTACTS = 'contacts';

@Injectable()
export class CardService extends BaseEntityService<any> {

  items$: Observable<any[]>;
  item$: Observable<boolean>;
  selectedAll$: Observable<boolean>;

  private itemsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private itemSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private selectedAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    protected apiBaseService: ApiBaseService
  ) {
    super(apiBaseService);
    this.items$ = this.itemsSubject.asObservable();
    this.item$ = this.itemSubject.asObservable();
    this.selectedAll$ = this.selectedAll.asObservable();
    this.url = 'account/cards';
  }

  getItem(): Observable<any> {
    return this.item$;
  }

  getItems(): Observable<Array<any>> {
    return this.items$;
  }

  getCard(id: any) {
    this.get(id).subscribe(response => {
      this.itemSubject.next(response.data);
    });
  }

  getCards() {
    this.getAll().subscribe(response => {
      this.itemsSubject.next(response.data);
    });
  }

  createCard(card: any) {
    this.create({card: card}).subscribe(response => {
      this.itemSubject.next(response.data);
      this.itemsSubject.next([response.data, ...this.itemsSubject.getValue()]);
    });
  }

  updateCard(card: any) {
    this.apiBaseService.patch(`${this.url}/${card.uuid}`, card).subscribe(response => {
      this.itemSubject.next(response.data);
      const items = this.itemsSubject.getValue();
      items.forEach(item => {
        if (item.uuid === response.data.uuid) {
          item.card_name = response.data.card_name;
          return;
        }
      });
      this.itemsSubject.next(items);
    });
  }

  setUrl(accountId: string) {
  }
}
