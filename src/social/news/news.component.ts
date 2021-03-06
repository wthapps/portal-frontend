import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiBaseService } from '@shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { PostEditComponent } from '../shared/second-routes/post/post-edit.component';
import { PostService } from '../shared/second-routes/post/shared/post.service';

@Component({
  selector: 'app-social-news',
  templateUrl: 'news.component.html',
  styleUrls: ['news.component.scss']
})
export class ZSocialNewsComponent implements OnInit {
  @ViewChild('postEditModal') modalShare: PostEditComponent;

  channels: any;
  feeds: any;
  link: any;
  feedLoading: boolean;
  channelLoading: boolean;

  constructor(
    private apiBaseService: ApiBaseService,
    private router: Router,
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      if (!params.q) {
        this.router.navigate([`/news`], {
          queryParams: { q: 'category::all' }
        });
      } else {
        this.searchFeeds(params.q);
      }
    });
    this.loadChannels();

    this.feedLoading = true;
    this.apiBaseService
      .get('zone/social_network/feeds')
      .subscribe((response: any) => {
        console.log('feeds response:::', response);
        this.feedLoading = false
      }, err => this.feedLoading = false);
  }

  doEvents(event: any) {
    if (event.action == 'reload') {
      this.loadChannels();
      this.searchFeeds('category::all');
    }
  }

  searchFeeds(text: any) {
    this.feedLoading = true;
    this.apiBaseService
      .post(`zone/social_network/feeds/search_feeds`, { q: text })
      .subscribe((res: any) => {
        this.feeds = res.data;
        this.feedLoading = false;
      }, err => this.feedLoading = false);
  }

  loadChannels() {
    this.channelLoading = true;
    this.apiBaseService
      .get(`zone/social_network/feeds/get_my_channels`, { q: 'all' })
      .subscribe((res: any) => {
        this.channels = res.data;
        this.channelLoading = false;
      }, err => this.channelLoading = false);
  }

  openModalShare(feed: any) {
    this.link = null;
    this.modalShare.loading();
    this.apiBaseService
      .post(`zone/social_network/feeds/get_link_resource`, { link: feed.link })
      .subscribe((res: any) => {
        // this.channels = res.data.map((subscription: any) => {return subscription.feed_link})
        this.link = res.data;
        this.modalShare.stopLoading();
      });
    this.modalShare.open();
  }

  dismiss(event: any) {
    //
  }

  save(options: any = { mode: 'edit', item: null, isShare: false }) {
    this.postService
      .add(options.item)
      .toPromise()
      .then(
        (response: any) => {
          this.modalShare.close();
        },
        (error: any) => {
          console.log('error', error);
        }
      );
  }
}
