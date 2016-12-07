import { Component, OnInit } from '@angular/core';
import { SocialService } from '../services/social.service';
import { SoUser } from '../../../shared/models/social_network/so-user.model';

declare var _:any;

@Component({
  moduleId: module.id,
  selector: 'z-social-members',
  templateUrl: 'members.component.html'
})

export class ZSocialMembersComponent implements OnInit {
  errorMessage: string;
  user: SoUser = new SoUser();
  data: any = [];
  list: any = [];
  notifications: any = {};
  currentState: string = 'friends'; //followers, followings, blacklists
  favourite:any;

  constructor(private socialService: SocialService) {
  }

  ngOnInit() {
    this.getUser();
    this.socialService.user.getNotifications().subscribe(
      (res:any) => {
        console.log(res);
        this.notifications = res.data;
      }
    );
  }

  getDataList(type: string) {
    this.currentState = type;
    this.list = this.data[type];
    return false;
  }

  unfriend(uuid:any) {
    this.socialService.user.unfriend(uuid).subscribe(
      (res: any) => {
        this.getUser();
      },
    );
  }

  unfollow(uuid:any) {
    this.socialService.user.unfollow(uuid).subscribe(
      (res: any) => {
        this.getUser();
      },
    );
  }

  follow(uuid:any) {
    this.socialService.user.follow(uuid).subscribe(
      (res: any) => {
        this.getUser();
      },
    );
  }

  getUser() {
    this.socialService.user.get().subscribe(
      (res: any) => {
        this.data = res.data;
        this.addFollowingIntoFollower();
        this.list = res.data[this.currentState];
      },
      error => this.errorMessage = <any>error
    );
  }

  addFollowingIntoFollower() {
    this.data['followers'] = _.map(this.data['followers'], (follower:any) => {
      follower.isFollowing = false;
      _.forEach(this.data['followings'], (following:any) => {
        if (follower.uuid == following.uuid) {
          follower.isFollowing = true;
        }
      });
      return follower;
    });
  }

  getFavourite(uuid:any) {
    this.socialService.user.getFavourite(uuid, "friend").subscribe(
      (res:any) => {
        this.favourite = res.data
      }
    );
  }

  addFavourite(uuid:any) {
    this.socialService.user.addFavourites(uuid, "friend").subscribe(
      (res:any) => {
        this.favourite = res.data
      }
    );
  }

  getNotifications() {
    this.currentState = 'notification';
    this.list = this.notifications;
    return false;
  }
}
