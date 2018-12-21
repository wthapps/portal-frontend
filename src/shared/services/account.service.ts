import { Injectable } from '@angular/core';

import { BaseEntityService } from '@wth/shared/services/base-entity-service';
import { ApiBaseService } from '@wth/shared/services/apibase.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class AccountService extends BaseEntityService<any> {

  items$: Observable<any[]>;
  item$: Observable<boolean>;

  private itemsSubject: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  private itemSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    protected apiBaseService: ApiBaseService
  ) {
    super(apiBaseService);
    this.items$ = this.itemsSubject.asObservable();
    this.item$ = this.itemSubject.asObservable();
    this.url = 'contact/cards';
  }

  getItem(): Observable<any> {
    return this.item$;
  }

  getItems(): Observable<Array<any>> {
    return this.items$;
  }

  getAccount(id: any) {
    this.get(id).subscribe(response => {
      this.itemSubject.next(response.data.attributes);
    });
  }

  getAccounts() {
    this.getAll().subscribe(response => {
      this.itemsSubject.next(response.data);
    });
  }

  search() {
    this.apiBaseService.get(`account/get_my_contacts_accounts?size=1000`).subscribe(response => {
      this.itemsSubject.next(response.data);
    });
  }
}
