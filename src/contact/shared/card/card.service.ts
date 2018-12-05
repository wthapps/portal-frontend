import { Injectable } from '@angular/core';

import { Observable ,  Subject ,  BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiBaseService, BaseEntityService } from '../../../shared/services';
import { _wu } from '../../../shared/shared/utils/utils';
import { Contact } from '../../contact/contact.model';
import { MaxLengthPipe } from '../../../shared/shared/pipe/max-length.pipe';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

declare var _: any;
declare var Promise: any;
export const ITEM_PER_PAGE = 50;
export const OTHER_CONTACTS = 'others';
export const MY_CONTACTS = 'contacts';

@Injectable()
export class CardService extends BaseEntityService<any> {

  items$: Observable<any[]>;
  item$: Observable<boolean>
  selectedAll$: Observable<boolean>;
  sharedCardNum$: Observable<number>;
  publicCard$: Observable<any>;
  businessCards$: Observable<any[]>;

  private itemsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private itemSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private selectedAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private sharedCardNumSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private publicCardSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private businessCardsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);

  constructor(
    protected apiBaseService: ApiBaseService,
    private toastService: ToastsService
  ) {
    super(apiBaseService);
    this.items$ = this.itemsSubject.asObservable();
    this.item$ = this.itemSubject.asObservable();
    this.selectedAll$ = this.selectedAll.asObservable();
    this.sharedCardNum$ = this.sharedCardNumSubject.asObservable();
    this.publicCard$ = this.publicCardSubject.asObservable();
    this.businessCards$ = this.businessCardsSubject.asObservable();
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
      const cards = response.data.map(c => c.attributes);
      this.itemsSubject.next(cards);
      this.parseCardbyType(cards);
    });
  }

  getSharedCardNum() {
    this.apiBaseService.get(`${this.url}/shared_card_num`).subscribe(response => {
      this.sharedCardNumSubject.next(response.data.shared_card_num);
    });
  }

  getSharedCards() {
    this.getAll({}, 'contact/cards/shared').subscribe(response => {
      this.itemsSubject.next(response.data);
    });
  }

  createCard(card: any) {
    this.create({card: card}).subscribe(response => {
      this.itemSubject.next(response.data);
      // this.itemsSubject.next([response.data, ...this.itemsSubject.getValue()]);
      this.businessCardsSubject.next([response.data, ...this.businessCardsSubject.getValue()]);
    });
  }

  updateCard(card: any) {
    this.apiBaseService.patch(`${this.url}/${card.uuid}`, card).subscribe(response => {
      this.itemSubject.next(response.data.attributes);
      const items = this.itemsSubject.getValue();
      items.forEach(item => {
        if (item.uuid === response.data.attributes.uuid) {
          item.card_name = response.data.attributes.card_name;
          item.profile_image = response.data.attributes.profile_image;
          return;
        }
      });
      this.itemsSubject.next(items);
      this.parseCardbyType(items);
      this.toastService.success('You updated card successfully!');
    });
  }

  shareCard(card: any, users: any) {
    this.apiBaseService.post(`${this.url}/${card.uuid}/share`, {users: users}).subscribe(response => {
      this.itemSubject.next(response.data.attributes);
      const items = this.itemsSubject.getValue();
      items.forEach(item => {
        if (item.uuid === response.data.attributes.uuid) {
          item.card_name = response.data.attributes.card_name;
          return;
        }
      });
      this.itemsSubject.next(items);
      this.toastService.success('You shared card successfully!');
    });
  }

  exportCard(card: any) {
    console.log('your are exporting card:::', card);
  }

  deleteCard(card: any) {
    this.delete(card.uuid).subscribe(response => {
      const items = this.businessCardsSubject.getValue();
      items.forEach((item, index) => {
        if (item.uuid === card.uuid) {
          items.splice(index, 1);
          this.businessCardsSubject.next(items);
          return;
        }
      });
      this.toastService.success('You deleted card successfully!');
    });
  }

  private parseCardbyType(cards: Array<any>) {
    const bizCards = [];
    cards.forEach(c => {
      if (c.card_type === 'public') {
        this.publicCardSubject.next(c);
      } else {
        bizCards.push(c);
      }
    });
    this.businessCardsSubject.next(bizCards);
  }
}
