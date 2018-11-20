import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { CardService } from '../card.service';
import { Observable } from 'rxjs';


declare var $: any;

@Component({
  selector: 'card-list',
  templateUrl: 'card-list.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CardListComponent implements OnInit {
  selectedValues: string[] = [];

  cards$: Observable<Array<any>>;

  constructor(private confirmationService: ConfirmationService, private cardService: CardService) {
    this.cards$ = this.cardService.getItems();
  }

  ngOnInit() {
    this.cardService.getCards({});
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
}
