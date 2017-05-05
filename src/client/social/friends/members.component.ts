import { Component, OnInit } from '@angular/core';
import { SoUser } from '../../core/shared/models/social_network/so-user.model';
import { SocialService } from '../shared/services/social.service';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { NotificationService } from '../../core/shared/services/notification.service';


declare var $: any;
declare var _: any;

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
  notifications: any = [];
  newNotifications: any = [];
  currentState: string = 'friends'; //followers, followings, blacklists
  currentStateTitle: string = 'FRIENDS'; //followers, followings, blacklists
  currentStateTitleNumber: number = 0; //followers, followings, blacklists
  favourite: any;

  constructor(private socialService: SocialService,
              private notificationService: NotificationService,
              private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    this.getUser();
    // this.callNotifications();
  }

  callNotifications() {
    this.socialService.user.getNotifications().subscribe(
      (res: any) => {
        this.notifications = res.data;
        this.newNotifications = _.filter(this.notifications, {'seen_state': 'new'});
        // this.list = this.notifications;
      }
    );
  }

  getDataList(type: string) {
    this.currentState = type;
    this.list = this.data[type];
    return false;
  }

  unfriend(uuid: any) {
    this.socialService.user.unfriend(uuid).subscribe(
      (res: any) => {
        this.getUser();
      },
    );
  }

  unfollow(uuid: any) {
    this.socialService.user.unfollow(uuid).subscribe(
      (res: any) => {
        this.getUser();
      },
    );
  }

  follow(uuid: any) {
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
        if (this.currentState != 'notification') {
          this.list = res.data[this.currentState];
        }
      },
      error => this.errorMessage = <any>error
    );
  }

  addFollowingIntoFollower() {
    this.data['followers'] = _.map(this.data['followers'], (follower: any) => {
      follower.isFollowing = false;
      _.forEach(this.data['followings'], (following: any) => {
        if (follower.uuid == following.uuid) {
          follower.isFollowing = true;
        }
      });
      return follower;
    });
  }

  getFavourite(uuid: any) {
    this.socialService.user.getFavourite(uuid, 'friend').subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  addFavourite(uuid: any) {
    this.socialService.user.toggleFavourites(uuid, 'friend').subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  getNotifications() {
    this.currentState = 'notification';
    // this.list = this.notifications;
    this.socialService.user.checkedNotifications().subscribe(
      (res: any) => {
        this.notifications = res.data;
        this.newNotifications = _.filter(this.notifications, {'seen_state': 'new'});
        this.list = this.notifications;
        // this.getUser();
      }
    );
  }

  doAction(action: any, notif_id: string) {
    this.notificationService.doAction(action, notif_id);

    // let api: any = null;
    // switch (action.method) {
    //   case 'post':
    //     api = this.apiBaseService.post(action.link, action.params);
    //     break;
    //   case 'delete':
    //     api = this.apiBaseService.delete(action.link);
    //     break;
    // }

    // api.subscribe(
    //   (res: any) => {
    //     this.callNotifications();
    //     this.getUser();
    //   }
    // );
  }


  focusSearchFriends() {
    $('#searchTopHeader').focus();
  }
}
