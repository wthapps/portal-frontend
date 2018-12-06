import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CardService } from '../shared/card';
import { CardEditModalComponent } from '@contacts/shared/card/components';
import { ProfileService } from '@shared/user/services';
import { AccountService, ApiBaseService, AuthService, CommonEventService, WthConfirmService } from '@shared/services';
import { ShareEditorComponent } from '@shared/components/editors/share/share-editor.component';
// import { WContactSelectionComponent } from '@shared/components/w-contact-selection/w-contact-selection.component';

@Component ({
  selector: 'w-user-profile-page',
  templateUrl: 'profile-page.component.html',
  styleUrls: ['profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  @ViewChild('cardEditModal') cardEditModal: CardEditModalComponent;
  @ViewChild('cardDetailModal') cardDetailModal: CardEditModalComponent;
  // @ViewChild('contactSelectionModal') contactSelectionModal: WContactSelectionComponent;
  @ViewChild('shareEditor') shareEditor: ShareEditorComponent;



  cards$: Observable<Array<any>>;
  card$: Observable<any>;
  profile$: Observable<any>;
  users$: Observable<Array<any>>;
  currentCard: any;
  publicCard$: Observable<any>;
  destroy$ = new Subject();

  readonly BIZ_CARD = `Business Cards help you share private contact information with other users`;
  readonly PUBLIC_CARD = `Your Public Profile is the default card for your public information on all apps on the WTHApps site`;

  constructor(private authService: AuthService,
              private cardService: CardService,
              private profileService: ProfileService,
              private confirmationService: WthConfirmService,
              private accountService: AccountService,
              private commonEventService: CommonEventService) {
    this.cards$ = this.cardService.businessCards$;
    this.publicCard$ = this.cardService.publicCard$;

    this.card$ = this.cardService.getItem();
    this.users$ = this.accountService.getItems();
    this.handleSelectCropEvent();
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
    if (payload.editImage) {
      this.commonEventService.broadcast({
        channel: 'SELECT_CROP_EVENT',
        action: 'SELECT_CROP:OPEN',
        payload: {
          currentImage: this.authService.user.profile_image,
          card: payload.card
        },
      });
      this.cardDetailModal.close();
    } else {
      this.profileService.get(this.authService.user.uuid);
      this.cardEditModal.open({...payload, mode: 'edit'});
    }
  }

  selectUsers(payload: any) {

    this.currentCard = payload.card;
    this.accountService.search();
    this.shareEditor.open({
      title: 'Share card',
      object: payload.card
    });
    // this.contactSelectionModal.open({title: 'Select Contact'});
  }

  shareCard(payload: any) {
    this.cardService.shareCard(this.currentCard, payload);
    this.shareEditor.close();
  }

  exportCard(card: any) {
    this.cardService.exportCard(card);
    this.cardDetailModal.close();
  }

  deleteCard(card: any) {
    this.confirmationService.confirm({
      header: 'Delete Card',
      message: `Deleted this card will remove it from shared user’s contact book. <br> This action can’t be undone.`,
      accept: () => {
        this.cardService.deleteCard(card);
        this.cardDetailModal.close();
      }
    });
  }

  handleSelectCropEvent() {
    this.commonEventService.filter((event: any) => event.channel === 'SELECT_CROP_EVENT')
      .pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        this.doEvent(event);
      });
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'SELECT_CROP:DONE':
        if (event.card) {
          this.cardService.updateCard({...event.card, avatar: event.payload});
        }
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
