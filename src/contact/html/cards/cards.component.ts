import { Component, OnInit, ViewEncapsulation } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-contact-html-cards',
  templateUrl: 'cards.component.html',
  styleUrls: ['cards.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactHtmlCardsComponent implements OnInit {
  selectedValues: string[] = [];

  constructor() {
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
}
