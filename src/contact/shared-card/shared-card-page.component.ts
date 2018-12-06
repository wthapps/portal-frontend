import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

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
  sortField = 'created_at'
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
    const query = {sortby: this.sortDesc ? `-${this.sortDesc}` : `+${this.sortField}`};
    this.cardService.getSharedCards(query);
  }

  changeSortField(field: string) {
    this.sortField = field;
    this.sortFieldName = this.sortField === 'card_name' ? 'Card name' : this.sortField === 'owner_name' ? 'Owner name' : 'Recent shared';
    const query = {sortby: this.sortDesc ? `-${this.sortDesc}` : `+${this.sortField}`};
    this.cardService.getSharedCards(query);
  }
}
