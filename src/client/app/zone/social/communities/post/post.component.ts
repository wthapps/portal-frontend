import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { LoadingService } from '../../../../partials/loading/loading.service';
import { PostListComponent } from '../../post/post-list.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail-post',
  templateUrl: 'post.component.html'
})

export class ZSocialCommunityDetailPostComponent implements OnInit {
  @ViewChild('posts') postList: PostListComponent;

  errorMessage: string = '';
  data: any = [];
  uuid: string = '';

  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.postList.type = "community";
    // this.loadingService.start('.zone-social-cover');
    this.route.params.subscribe(params => {

      this.uuid = params['id'];
      this.getItem(params['id']);

    });
  }

  getItem(id: string) {
    this.apiBaseServiceV2.get(`zone/social_network/communities/${id}`).subscribe(
      (res: any)=> {
        this.data = res.data;
        // this.loadingService.stop('.zone-social-cover');
      },
      error => this.errorMessage = <any>error
    );
  }
}
