import { Injectable } from '@angular/core';

import { Observable ,  Subject ,  BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiBaseService, BaseEntityService } from '../../../shared/services';
import { _wu } from '../../../shared/shared/utils/utils';
import { Contact } from '../../contact/contact.model';
import { MaxLengthPipe } from '../../../shared/shared/pipe/max-length.pipe';

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
    this.url = 'contact/cards';
  }

  getItem(): Observable<any> {
    return this.item$;
  }

  getItems(): Observable<Array<any>> {
    return this.items$;
  }

  getCard(id: any) {
    this.get(id).subscribe(response => {
      this.itemSubject.next(response.data.attributes);
    });
  }

  getCards() {
    this.getAll().subscribe(response => {
      this.itemsSubject.next(response.data);
    });
  }

  getSharedCards() {
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
      this.itemSubject.next(response.data.attributes);
      const items = this.itemsSubject.getValue();
      items.forEach(item => {
        if (item.uuid === response.data.attributes.uuid) {
          item.card_name = response.data.attributes.card_name;
          return;
        }
      });
      this.itemsSubject.next(items);
    });
  }

  exportCard(card: any) {
    console.log('your are exporting card:::', card);
  }

  deleteCard(card: any) {
    this.delete(card.uuid).subscribe(response => {
      const items = this.itemsSubject.getValue();
      items.forEach((item, index) => {
        if (item.uuid === card.uuid) {
          items.splice(index, 1);
          this.itemsSubject.next(items);
          return;
        }
      });

    });
  }
}
