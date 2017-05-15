import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostListComponent } from '../../shared/post/post-list.component';
import { PostNewComponent } from '../../shared/post/post-new.component';
import { SocialService } from '../../shared/services/social.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ZSocialProfileDataService } from '../profile-data.service';



@Component({
  moduleId: module.id,
  selector: 'z-social-profile-friend',
  templateUrl: 'friend.component.html'
})

export class ZSocialProfileFriendComponent implements OnInit {
  userInfo:any;
  list:any;

  constructor(private socialService: SocialService,
              private route: ActivatedRoute,
              private profileDataService: ZSocialProfileDataService,
              private router: Router) {}

  ngOnInit() {

    this.profileDataService.profileData$.take(1).subscribe((res: any) => {
      this.userInfo = res.data;
    });

    this.route.params.subscribe(params => {
      this.socialService.user.getFriends(params['id']).subscribe(
        (res: any) => {
          console.log(res);
          this.list = res.data;
          // this.userInfo = res.data;
        }
      );
    });
  }

  onLoadMore() {

  }

}
