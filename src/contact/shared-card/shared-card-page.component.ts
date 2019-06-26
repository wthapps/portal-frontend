import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '@shared/services';
import { ProfileService } from '@shared/user/services';
import { CardService } from '@contacts/shared/card';
import { CardDetailModalComponent } from '@shared/user/card';

@Component({
  selector: 'shared-card-page',
  templateUrl: 'shared-card-page.component.html',
  styleUrls: ['shared-card-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharedCardPageComponent implements OnInit {
  @ViewChild('cardDetailModal') cardDetailModal: CardDetailModalComponent;

  cards$: Observable<Array<any>>;
  card$: Observable<any>;
  profile$: Observable<any>;

  sortFieldName = 'Recent shared';
  sortDesc = true;

  CARD_NAME = 'card_name';
  USER_NAME = 'users.name';
  UPDATED_AT = 'con_shared_cards.updated_at';
  sortField = this.UPDATED_AT;

  constructor(private authService: AuthService,
              private cardService: CardService,
              private profileService: ProfileService) {

    this.cards$ = this.cardService.getItems();
    this.card$ = this.cardService.getItem();
    this.profile$ = this.profileService.getProfile();
  }

  ngOnInit() {
    this.cardService.getSharedCards({sort: this.sortField + ':desc'});
  }

  viewCard(card: any) {
    this.cardService.getCard(card.uuid);
    this.cardDetailModal.open({});
  }

  changeSortDirection() {
    this.sortDesc = !this.sortDesc;
    const query = {sort: `${this.sortField}:${this.sortDesc ? 'desc' : 'asc'}`};
    this.cardService.getSharedCards(query);
  }

  changeSortField(field: string) {
    this.sortField = field;
    this.sortDesc = true;
    this.sortFieldName = this.sortField === this.CARD_NAME ? 'Card name' :
                         this.sortField === this.USER_NAME ? 'Owner name' : 'Recent shared';
    const query = {sort: `${this.sortField}:${this.sortDesc ? 'desc' : 'asc'}`};
    this.cardService.getSharedCards(query);
  }
}
