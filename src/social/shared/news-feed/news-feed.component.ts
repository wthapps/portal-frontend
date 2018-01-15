import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

declare var _: any;

/**
 * This class represents the navigation bar component.
 */
@Component({
  selector: 'app-social-shared-news-feed',
  templateUrl: 'news-feed.component.html',
  styleUrls: ['news-feed.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZSocialSharedNewsFeedComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  selectedValues: string[] = [];

  constructor() {
  }

  ngOnInit(): void {

  }

  openModal() {
    this.modal.open();
  }

  onSave() {
    console.log(this.selectedValues);
    this.modal.close();
  }
}
