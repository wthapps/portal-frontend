import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Router } from "@angular/router";
import { ApiBaseService } from "@shared/services";

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
  @ViewChild('modalNew') modalNew: ModalComponent;
  @ViewChild('modalEdit') modalEdit: ModalComponent;

  selectedValues: string[] = [];
  @Input() channels: any;
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router, private apiBaseService: ApiBaseService) {
  }

  ngOnInit(): void {

  }

  onSave() {
    this.modalNew.close();
    this.events.emit({action: 'reload'});
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

  toogleFollow(channel: any) {
    this.apiBaseService.post(`zone/social_network/feeds/subscribe`, {id: channel.id}).subscribe((res: any) => {
      if(res.data.length == 0) {
        channel.subscribed = false;
      } else {
        channel.subscribed = true;
      }
    })
  }
}
