import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { CardService } from '../card.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../shared/services';
import { ProfileService } from '../../../../shared/user/services';
import { CardEditModalComponent } from './card-edit-modal.component';


declare var $: any;

@Component({
  selector: 'card-list',
  templateUrl: 'card-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CardListComponent implements OnInit {
  @ViewChild('cardEditModal') cardEditModal: CardEditModalComponent;
  cards$: Observable<Array<any>>;
  profile$: Observable<any>;

  CARD_TOOLTIP = `Your Public Card is the default card for your public information on all apps on the WTHApps site.
   You can also have private cards that you can share.`;
  PUBLIC_CARD_TOOLTIP = 'Your Public Card is the default card for your public information on all apps on the WTHApps site.';
  PRIVATE_CARD_TOOLTIP = 'Private Card help you share private contact information with other users.';
  constructor(
    private authService: AuthService,
    private cardService: CardService,
    private profileService: ProfileService,
    private confirmationService: ConfirmationService) {

    this.cards$ = this.cardService.getItems();
    this.profile$ = this.profileService.getProfile();

  }

  ngOnInit() {
    this.cardService.getCards();
  }

  onShowModalEdit(event: any) {
    const zIndex = 1050 + (10 * $('.modal:visible').length);
    $(event.target).css('z-index', zIndex);
    setTimeout(() => {
      $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
  }
  
  onSave(payload: any) {
    if (payload.mode === 'edit') {
      console.log('updating card:::', payload.card);
      this.cardService.update(payload.card).subscribe(response => {
        console.log('response');
      });

    } else if (payload.mode === 'create') {

    }
  }

  onDelete() {
    this.confirmationService.confirm({
      header: 'Delete information card',
      message: `Deleted this card will remove it from shared user’s contact book. <br> This action can’t be undone.`,
      accept: () => {
        // Actual logic to perform a confirmation
      }
    });
  }

  openEditModal(payload: any) {
    this.profileService.get(this.authService.user.uuid);
    this.cardEditModal.open({...payload, mode: 'edit'});
  }

}
