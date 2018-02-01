import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from "@angular/router";

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
  @Input() channels: any;

  constructor(private router: Router) {
  }

  ngOnInit(): void {

  }

  openModal() {
    this.modal.open();
  }

  onSave() {
    this.modal.close();
  }

  onClick(q: any) {
    this.router.navigate([`/news`], {queryParams: {q: q}});
  }

  onEnter(event: any) {
    console.log(event);
  }

  onEscape(event: any) {
    console.log(event);
  }

  onKey(event: any) {
    console.log(event);
  }
}
