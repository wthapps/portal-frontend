import { Component, ViewChild } from '@angular/core';
import { PostListComponent } from '../shared/post/post-list.component';
import { CommunitiesDataService } from './communities-data.service';

declare let $ : any;
declare let _ : any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community',
  templateUrl: 'communities.component.html'
})

export class ZSocialCommunityComponent {
  @ViewChild('posts') posts: PostListComponent;

  constructor(private comDataService: CommunitiesDataService) {

  }

  private debounceOnScroll = _.debounce((event:any) => this.onScroll(event), 500, {});

  onScroll(event: any) {
    // if (!this.isPostTab)
    //   return;
    // if($(window).scrollTop() + $(window).height() > $(document).height() - 10) {
    let elem = $('.page-body-content');

    if ( !this.isLoadingDone() && elem[0].scrollHeight  - elem.scrollTop() - 10 <= elem.outerHeight() ) {
      this.loadMorePosts();
      console.log("Load more posts");
    }
  }

  isLoadingDone() {
    // this.posts && this.posts.loading_done
    return this.comDataService.loadingDone;
  }

  loadMorePosts() {
    this.comDataService.updatePost(true);
  }
}
