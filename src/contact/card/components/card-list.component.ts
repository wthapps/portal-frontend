import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { CardService } from '../card.service';
import { Observable } from 'rxjs';
import { AuthService } from '@shared/services';
import { ProfileService } from '@shared/user/services';
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

  constructor(
    private authService: AuthService,
    private cardService: CardService,
    private profileService: ProfileService,
    private confirmationService: ConfirmationService) {

    this.cards$ = this.cardService.getItems();
    this.profile$ = this.profileService.getProfile();

  }

  ngOnInit() {
    this.cardService.getCards(this.authService.user.uuid);
    this.profileService.get(this.authService.user.uuid);
  }

  onShowModalEdit(event: any) {
    const zIndex = 1050 + (10 * $('.modal:visible').length);
    $(event.target).css('z-index', zIndex);
    setTimeout(() => {
      $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
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
    this.cardEditModal.open({...payload, mode: 'edit'});
  }

}
