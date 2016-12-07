import { Component, ViewChild, OnInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { PostListComponent } from '../../post/post-list.component';
import { PostNewComponent } from '../../post/post-new.component';
import { SocialService } from '../../services/social.service';
import { UserService } from '../../../../shared/services/user.service';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-post',
  templateUrl: 'post.component.html'
})

export class ZSocialProfilePostComponent implements OnInit {
  @ViewChild('posts') posts: PostListComponent;
  @ViewChild('postNew') postNew: PostNewComponent;

  uuidUser: string = '';
  errorMessage: string = '';

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private apiBaseService: ApiBaseServiceV2,
              private userService: UserService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      console.log(params);
    });
  }
}
