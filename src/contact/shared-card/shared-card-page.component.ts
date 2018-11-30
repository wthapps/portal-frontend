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
  encapsulation: ViewEncapsulation.None
})
export class SharedCardPageComponent implements OnInit {
  @ViewChild('cardDetailModal') cardDetailModal: CardDetailModalComponent;

  cards$: Observable<Array<any>>;
  card$: Observable<any>;
  profile$: Observable<any>;

  constructor(private authService: AuthService,
              private cardService: CardService,
              private profileService: ProfileService) {

    this.cards$ = this.cardService.getItems();
    this.card$ = this.cardService.getItem();
    this.profile$ = this.profileService.getProfile();
  }

  ngOnInit() {
    this.cardService.getSharedCards();
  }

  viewCard(card: any) {
    this.cardService.getCard(card.uuid);
    this.cardDetailModal.open({});
  }
}
