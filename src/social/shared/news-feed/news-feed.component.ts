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
  addChannels: any = [];
  categories: any = [];
  channelChanged: any = false;
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router, private apiBaseService: ApiBaseService) {
  }

  ngOnInit(): void {

  }

  onSave() {
    this.modalNew.close();
    this.modalEdit.close();
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
    this.apiBaseService.post(`zone/social_network/feeds/search_channels`, {q: event.search}).subscribe((res: any) => {
      this.addChannels = res.data;
    });
  }

  toogleFollow(channel: any) {
    this.apiBaseService.post(`zone/social_network/feeds/subscribe`, {id: channel.id}).subscribe((res: any) => {
      this.addChannels = this.addChannels.map((channel: any) => {
        if(channel.id == res.data.id) {
          return res.data;
        } else {
          return channel
        }
      })
      this.channels = this.channels.map((channel: any) => {
        if(channel.id == res.data.id) {
          return res.data;
        } else {
          return channel
        }
      })
    })
  }

  openNewModal() {
    this.modalNew.open();
    this.apiBaseService.post(`zone/social_network/feeds/search_channels`, {q: 'all'}).subscribe((res: any) => {
      this.addChannels = res.data;
    });
    this.apiBaseService.get(`zone/social_network/feeds/categories`).subscribe((res: any) => {
      this.categories = res.data;
    });
  }
}
