import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CardService } from '../shared/card';
import { CardEditModalComponent } from '@contacts/shared/card/components';
import { ProfileService } from '@shared/user/services';
import {
  AccountService,
  AuthService,
  CommonEventService,
  UserService,
  WthConfirmService
} from '@shared/services';
import { ShareEditorComponent } from '@shared/components/editors/share/share-editor.component';
// import { WContactSelectionComponent } from '@shared/components/w-contact-selection/w-contact-selection.component';

declare var $: any;

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
  destroy$ = new Subject();

  readonly BIZ_CARD = `Business Cards help you share private contact information with other users`;
  readonly PUBLIC_CARD = `All the information in your Public Profile card will be public`;

  constructor(private authService: AuthService,
              private cardService: CardService,
              private profileService: ProfileService,
              private userService: UserService,
              private confirmationService: WthConfirmService,
              private accountService: AccountService,
              private commonEventService: CommonEventService) {

    this.cards$ = this.cardService.items$;
    this.users$ = this.accountService.getItems();
    this.profile$ = this.profileService.myProfile$;

    this.handleSelectCropEvent();
  }
  
  ngOnInit(): void {
    this.cardService.getCards();
    this.profileService.getMyProfile();
  }

  closeCard(card: any) {
    this.cardService.setCard(null);
  }

  saveCard(payload: any) {
    const card = payload.card;

    if (payload.mode === 'edit') {
      if (card.card_type === 'public') {
        this.profileService.updateCard(card);
      } else {
        this.cardService.updateCard(card);
      }
    } else if (payload.mode === 'create') {
      this.cardService.createCard(card);
    }
    this.cardEditModal.close();
  }

  createCard() {
    // this.profileService.get(this.authService.user.uuid);
    // this.profileService.getMyProfile();
    this.cardEditModal.open({mode: 'create', card: null, cardType: 'business'});
  }

  viewCard(card: any) {
    if (card.card_type === 'business') {
      this.card$ = this.cardService.getItem();
      this.cardService.getCard(card.uuid);
    } else {
      this.card$ = this.profileService.profile$;
      this.profileService.getProfileNew(card.uuid);
    }

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
      // this.profileService.get(this.authService.user.uuid);
      // this.profileService.getMyProfile();
      this.cardEditModal.open({...payload, mode: 'edit'});
    }
  }

  selectUsers(payload: any) {

    this.currentCard = payload.card;
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

  changeAvatar(profile: any) {
    this.commonEventService.broadcast({
      channel: 'SELECT_CROP_EVENT',
      action: 'SELECT_CROP:OPEN',
      payload: {
        currentImage: profile.profile_image,
        user: profile
      }
    });
  }

  updateProfile(profile: any) {
    this.profileService.updateProfile(profile);
  }

  handleSelectCropEvent() {
    this.commonEventService.filter((event: any) => event.channel === 'SELECT_CROP_EVENT')
      .pipe(takeUntil(this.destroy$)).subscribe((event: any) => {
        this.handleUpdateAvatar(event);
      });
  }

  handleUpdateAvatar(event: any) {
    switch (event.action) {
      case 'SELECT_CROP:DONE':
        if (event.card) {
          this.cardService.updateCard({...event.card, avatar: event.payload});
        } else if (event.user) {
          this.userService.update({uuid: event.user.uuid, image: event.payload})
            .subscribe((result: any) => {
                this.profileService.getMyProfile();
              },
              error => {}
            );
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
