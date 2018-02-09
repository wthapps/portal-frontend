import { Component, OnInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
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
export class ZSocialSharedNewsFeedComponent implements OnInit, OnChanges {
  @ViewChild('modalNew') modalNew: BsModalComponent;
  @ViewChild('modalEdit') modalEdit: BsModalComponent;

  selectedValues: string[] = [];
  @Input() channels: any = [];
  addChannels: any = [];
  editChannels: any = [];
  categories: any = [];
  channelChanged: any = false;
  newSelectedCategory: any = 'all';
  editSelectedCategory: any = 'all';

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  constructor(private router: Router, private apiBaseService: ApiBaseService) {
  }

  ngOnInit(): void {
    // this.editChannels = [...this.channels];
  }

  ngOnChanges() {
    if(this.channels && this.channels.length > 0) {
      this.editChannels = [...this.channels];
    }
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

  onEditKey(event: any) {
    this.apiBaseService.get(`zone/social_network/feeds/get_my_channels`, {q: `name::${event.search}`}).subscribe((res: any) => {
      this.editChannels = res.data;
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
      this.editChannels = this.editChannels.map((channel: any) => {
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
