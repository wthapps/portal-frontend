import { Component, OnInit, ViewChild } from '@angular/core';
import { ZSocialNewsShareComponent } from './modal/share.component';
import { ApiBaseService } from "@shared/services";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-social-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss'],
})

export class ZSocialNewsComponent implements OnInit {
  @ViewChild('modalShare') modalShare: ZSocialNewsShareComponent;

  article: any = {
    uri: 'https://i-kinhdoanh.vnecdn.net/2018/01/10/biencam1-3203-1515575867_140x84.jpg'
  };
  channels: any;
  feeds: any;

  constructor(private apiBaseService: ApiBaseService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (!params.q) {
        this.router.navigate([`/news`], {queryParams: {q: 'category::all'}});
      } else {
        this.apiBaseService.post(`zone/social_network/feeds/search_feeds`, {q: params.q}).subscribe((res: any) => {
          this.feeds = res.data;
        })
      }
    })
    this.apiBaseService.get(`zone/social_network/feeds/get_my_channels`).subscribe((res: any) => {
      this.channels = res.data.map((subscription: any) => {return subscription.feed_link})
    })
  }

  openModalShare() {
    this.modalShare.open();
  }
}
