import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostListComponent } from '../../shared/post/post-list.component';
import { PostNewComponent } from '../../shared/post/post-new.component';
import { SocialService } from '../../shared/services/social.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';



@Component({
  moduleId: module.id,
  selector: 'z-social-profile-post',
  templateUrl: 'post.component.html'
})

export class ZSocialProfilePostComponent implements OnInit {
  @ViewChild('posts') posts: PostListComponent;
  @ViewChild('postNew') postNew: PostNewComponent;

  uuid: any;
  userInfo: any;

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private apiBaseService: ApiBaseService,
              private userService: UserService) {
  }

  ngOnInit() {
    // this.loadingService.start('.zone-social-cover');
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.socialService.user.get(this.uuid).subscribe(
        (res: any) => {
          this.userInfo = res.data;
        }
      );
    });
  }
}
