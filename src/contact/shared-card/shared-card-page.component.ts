import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from '@shared/services';
import { ProfileService } from '@shared/user/services';
import { CardService } from '@contacts/shared/card';
import { CardDetailModalComponent } from '@contacts/shared/card/components';

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
  sortField = 'updated_at';
  sortFieldName = 'Recent shared';
  sortDesc = true;

  constructor(private authService: AuthService,
              private cardService: CardService,
              private profileService: ProfileService) {

    this.cards$ = this.cardService.getItems();
    this.card$ = this.cardService.getItem();
    this.profile$ = this.profileService.getProfile();
  }

  ngOnInit() {
    this.cardService.getSharedCards({});
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
    this.sortFieldName = this.sortField === 'card_name' ? 'Card name' : this.sortField === 'user_name' ? 'Owner name' : 'Recent shared';
    const query = {sort: `${this.sortField}:${this.sortDesc ? 'desc' : 'asc'}`};
    this.cardService.getSharedCards(query);
  }
}
