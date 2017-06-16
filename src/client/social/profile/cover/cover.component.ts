import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { SocialService } from '../../shared/services/social.service';
import { UserService } from '../../../core/shared/services/user.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';
import { ZoneReportService } from '../../../core/shared/form/report/report.service';
import { Subject } from 'rxjs';


declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialProfileCoverComponent implements OnInit, OnChanges, OnDestroy {

  @Input() data: any;

  errorMessage: string = '';
  item: any = [];
  uuid: string = '';
  userInfo: any;

  relationships: any;
  showFriends:boolean = true;

  private destroySubject: Subject<any> = new Subject<any>();
  constructor(private apiBaseService: ApiBaseService,
              private socialService: SocialService,
              public userService: UserService,
              private zoneReportService: ZoneReportService,
              private toastsService: ToastsService,
              private route: ActivatedRoute) {
  }

  ngOnChanges() {
    if (this.data) {

      this.userInfo = this.data;

      // Only user can change his own profile / cover image
      if (this.userService.profile.uuid == this.userInfo.uuid) {
        this.userInfo.canEdit = true;
        // this.userInfo = Object.assign({}, this.userInfo, {canEdit: true});
      }

    }
    if (this.userInfo && this.userService.profile.uuid != this.userInfo.uuid) {
      this.showFriends = this.userInfo.settings.show_friends.value;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['id'] ? params['id'] : this.userService.getProfileUuid();

      if (this.userService.profile.uuid != params['id']) {
        this.socialService.user.getRelationShips(params['id'])
          .takeUntil(this.destroySubject)
          .subscribe((res: any) => {
            this.relationships = res.data;
          },
        );
      }
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  onCoverAction(event: any) {
    if(event.action == 'updateItem') {
      // Update profile via API call
      this.socialService.user.update(event.body)
        .subscribe((result: any) => {
          console.log('update profile sucess: ', result);
          let toastMsg = '';
          if (_.has(event.body, 'profile_image') )
            toastMsg = 'You have updated profile image successfully';
          else if (_.has(event.body, 'cover_image') )
            toastMsg = 'You have updated cover image of this community successfully';
          else
            toastMsg = result.message;

          this.toastsService.success(toastMsg);
        });
    }
  }

  onUpdated(item: any) {
    if (item) {
      this.userInfo = item;
    }
  }

  onAddfriend() {

    this.socialService.user.addFriend(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      }
    );
  }

  onUnfriend() {
    this.socialService.user.unfriend(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      },
    );
  }

  onCancelRequest() {
    this.socialService.user.cancelFriendRequest(this.userInfo.uuid).subscribe(
      (res: any) => {
        this.relationships = res.data;
      },
    );
  }


  onReport() {
    this.zoneReportService.member(this.userInfo.uuid);
    return false;
  }
}
