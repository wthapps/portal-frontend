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

  constructor(protected apiBaseService: ApiBaseService,
              private toastService: ToastsService) {
    super(apiBaseService);
    this.items$ = this.itemsSubject.asObservable();
    this.item$ = this.itemSubject.asObservable();
    this.selectedAll$ = this.selectedAll.asObservable();
    this.sharedCardNum$ = this.sharedCardNumSubject.asObservable();
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

  setCard(card: any) {
    this.itemSubject.next(card);
  }


  getCards() {
    this.getAll().subscribe(response => {
      const cards = response.data.map(c => c.attributes);
      this.setCards(cards);
    });
  }

  setCards(cards: Array<any>) {
    this.itemsSubject.next(cards);
  }

  getSharedCardNum() {
    this.apiBaseService.get(`${this.url}/shared_card_num`).subscribe(response => {
      this.sharedCardNumSubject.next(response.data.shared_card_num);
    });
  }

  getSharedCards(query: any) {
    this.getAll(query, 'contact/cards/shared').subscribe(response => {
      this.setCards(response.data);
      this.sharedCardNumSubject.next(response.data.length);
    });
  }

  createCard(card: any) {
    this.create({card: card}).subscribe(response => {
      const newCard = response.data;
      this.setCard(newCard);
      this.setCards([newCard, ...this.itemsSubject.getValue()]);
    });
  }

  updateCard(card: any) {
    this.apiBaseService.patch(`${this.url}/${card.uuid}`, card).subscribe(response => {
      this.setCard(response.data.attributes);
      const items = this.itemsSubject.getValue();
      items.forEach(item => {
        if (item.uuid === response.data.attributes.uuid) {
          item.card_name = response.data.attributes.card_name;
          item.profile_image = response.data.attributes.profile_image;
          return;
        }
      });
      this.setCards(items);
      this.toastService.success('You updated card successfully!');
    });
  }

  shareCard(card: any, payload: any) {
    this.apiBaseService.post(`${this.url}/${card.uuid}/share`, payload).subscribe(response => {
      const sharedCard = response.data.attributes;
      const items = this.itemsSubject.getValue();

      this.setCard(sharedCard);
      items.forEach(item => {
        if (item.uuid === sharedCard.uuid) {
          item.card_name = sharedCard.card_name;
          return;
        }
      });
      this.setCards(items);
      if (payload.newUsers.length > 0) {
        this.toastService.success('You shared card successfully!');
      } else {
        this.toastService.success('You update shared card successfully!');
      }
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
          this.setCards(items);
          return;
        }
      });
      this.toastService.success('You deleted card successfully!');
    });
  }

}
