import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

declare var $: any;

@Component({
  selector: 'card-detail',
  templateUrl: 'card-detail.component.html',
  styleUrls: ['card-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardDetailComponent implements OnInit {
  selectedValues: string[] = [];

  constructor(private confirmationService: ConfirmationService) {
  }

  ngOnInit() {
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
