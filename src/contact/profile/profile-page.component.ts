import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CardService } from '../card';
import { CardEditModalComponent } from '@contacts/card/components';
import { ProfileService } from '@shared/user/services';
import { AuthService } from '@shared/services';

@Component ({
  selector: 'w-user-profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  @ViewChild('cardEditModal') cardEditModal: CardEditModalComponent;
  @ViewChild('cardDetailModal') cardDetailModal: CardEditModalComponent;

  cards$: Observable<Array<any>>;
  card$: Observable<any>;
  profile$: Observable<any>;

  readonly BIZ_CARD = `Business Cards help you share private contact information with other users`;
  readonly PUBLIC_CARD = `Your Public Profile is the default card for your public information
                          on all apps on the WTHApps site`;

  constructor(private authService: AuthService,
              private cardService: CardService,
              private profileService: ProfileService) {
    this.cards$ = this.cardService.getItems();
    this.card$ = this.cardService.getItem();
  }
  
  ngOnInit(): void {
    this.cardService.getCards();
    this.profile$ = this.profileService.getProfile();
  }

  saveCard(payload: any) {
    if (payload.mode === 'edit') {
      this.cardService.updateCard(payload.card);
    } else if (payload.mode === 'create') {
      this.cardService.createCard(payload.card);
    }
    this.cardEditModal.close();
  }

  createCard() {
    this.profileService.get(this.authService.user.uuid);
    this.cardEditModal.open({mode: 'create', card: null, cardType: 'business'});
  }

  viewCard(card: any) {
    this.cardService.getCard(card.uuid);
    this.cardDetailModal.open({});
  }

  editCard(payload: any) {
    this.profileService.get(this.authService.user.uuid);
    this.cardEditModal.open({...payload, mode: 'edit'});
  }
}
