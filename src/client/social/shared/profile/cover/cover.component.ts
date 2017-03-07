import { Component, OnInit, Input, OnChanges } from '@angular/core';
// import { ApiBaseService } from '../../../../shared/services/apibase.service';
import { ActivatedRoute } from '@angular/router';
// import { LoadingService } from '../../../../partials/loading/loading.service';
// import { ZoneReportService } from '../../../shared/form/report/report.service';
import { SocialService } from '../../services/social.service';
import { ApiBaseService } from '../../../../core/shared/services/apibase.service';
import { UserService } from '../../../../core/shared/services/user.service';
import { LoadingService } from '../../../../core/partials/loading/loading.service';
import { ZoneReportService } from '../../form/report/report.service';
// import { UserService } from '../../../../shared/services/user.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-profile-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialProfileCoverComponent implements OnInit, OnChanges {

  @Input() data: any;

  errorMessage: string = '';
  item: any = [];
  uuid: string = '';
  userInfo: any;

  relationships: any;


  constructor(private apiBaseService: ApiBaseService,
              private socialService: SocialService,
              public userService: UserService,
              private loadingService: LoadingService,
              private zoneReportService: ZoneReportService,
              private route: ActivatedRoute) {
  }

  ngOnChanges() {
    if (this.data) {
      this.userInfo = this.data;
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['id'];

      if (this.userService.profile.uuid != params['id']) {
        this.socialService.user.getRelationShips(params['id']).subscribe((res: any) => {
            this.relationships = res.data;
          },
        );
      }

    });
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
