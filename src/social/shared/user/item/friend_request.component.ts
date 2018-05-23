import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SocialService } from '../../services/social.service';
import { SocialFavoriteService } from '../../services/social-favorites.service';
import * as fromMember from '../../../shared/actions/member';
import { Constants } from '@wth/shared/constant';

@Component({
  selector: 'z-social-share-friend-request',
  templateUrl: 'friend_request.component.html',
  styleUrls: ['friend_request.component.scss']
})
export class ZSocialShareFriendRequestComponent {
  @Input() data: any;
  @Input() type: any; // pending, received
  @Output() outEvent: EventEmitter<any> = new EventEmitter();

  REQUEST_TYPE: any = {
    pending: 'pending',
    received: 'received'
  }

  favourite: any; // toggle favourites status for members, communities

  friendStatus = Constants.friendStatus;
  tooltip: any = Constants.tooltip;

  constructor(private socialService: SocialService,
              private router: Router,
              private favoriteService: SocialFavoriteService) {
  }

  acceptRequest() {
    this.socialService.user.acceptFriendRequest(this.data.uuid).toPromise()
      .then(res => {
        console.debug(res);
        this.data = {...this.data, status: res.data.status};
      });
  }

  declineRequest() {
    this.socialService.user.declineFriendRequest(this.data.uuid).toPromise()
      .then(res => {
        this.outEvent.emit(
          {
            action: 'delete',
            data: this.data
          }
        );
      });
  }

  cancelRequest() {
    this.socialService.user.cancelFriendRequest(this.data.uuid).toPromise()
      .then(() => {
        this.outEvent.emit(
          {
            action: 'delete',
            data: this.data
          }
        );
      });
  }
}
