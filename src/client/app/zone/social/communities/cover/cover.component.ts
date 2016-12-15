import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../partials/loading/loading.service';

import { ZoneReportService } from '../../../shared/form/report/report.service';

import { ZSocialCommunityFormPreferenceComponent } from '../form/preferences.component';
import { ZSocialCommunityFormEditComponent } from '../form/edit.component';
import { SocialService } from '../../services/social.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { UserService } from '../../../../shared/services/user.service';
import { ToastsService } from '../../../../partials/toast/toast-message.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-cover',
  templateUrl: 'cover.component.html'
})

export class ZSocialCommunityCoverComponent implements OnInit, OnChanges {

  @ViewChild('modalEdit') modalEdit: ZSocialCommunityFormEditComponent;
  @ViewChild('modalPreference') modalPreference: ZSocialCommunityFormPreferenceComponent;

  @Input() data: any;

  errorMessage: string = '';
  item: any = [];
  uuid: string = '';
  favourite: any;
  sentJoinRequest: boolean = false;
  invitation: any = undefined;


  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private zoneReportService: ZoneReportService,
              private confirmationService: ConfirmationService,
              private socialService: SocialService,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {
  }

  ngOnChanges() {
    if (this.data) {
      this.item = this.data;
    }
  }

  ngOnInit() {
    // this.loadingService.start('.zone-social-cover');
    this.route.params.subscribe(params => {
      this.uuid = params['id'];
      this.checkJoinRequestStatus();
    });
  }

  onDelete(item: any) {
    console.log(item);
    this.confirmationService.confirm({
      message: `Are you sure to delete the community ${item.name}`,
      header: 'Delete Community',
      accept: () => {
        this.loadingService.start();
        this.apiBaseServiceV2.delete(`zone/social_network/communities/${item.uuid}`)
          .subscribe((response: any) => {
              // console.log(response);
              this.onUpdated(response.data);
              this.router.navigateByUrl('/zone/social/communities');
              this.loadingService.stop();
            },
            error => {
              // console.log(error);
              this.toastsService.danger(error);
              this.loadingService.stop();
            }
          );
      }
    });

    return false;
  }

  onLeave(item: any) {

    this.confirmationService.confirm({
      message: this.userService.profile.uuid == item.admin.uuid ?
        `You are managing the community ${item.name}. This community would be deleted permanently. Are you sure to leave?` :
        `Are you sure to leave the community ${item.name}?`,
      header: 'Leave Community',
      accept: () => {
        this.loadingService.start();
        this.apiBaseServiceV2.post(`zone/social_network/communities/leave`, JSON.stringify({uuid: item.uuid}))
          .subscribe((response: any) => {
              this.loadingService.stop();
              this.router.navigateByUrl('/zone/social/communities');
            },
            error => {
              this.toastsService.danger(error);
              this.loadingService.stop();
            }
          );
      }
    });

    return false;
  }

  onEdit(item: any) {
    this.modalEdit.modal.open();
    this.item = item;
    return false;
  }

  onPreference(item: any) {
    this.modalPreference.modal.open();
    this.item = item;
    return false;
  }

  onUpdated(item: any) {
    if (item) {
      this.item = item;
    }
  }

  onReport() {
    this.zoneReportService.community(this.uuid);
    return false;
  }

  addFavourite(uuid: any) {
    this.socialService.user.addFavourites(uuid, 'community').subscribe(
      (res: any) => {

      }
    );
  }

  getFavourite(uuid: any) {
    this.socialService.user.getFavourite(uuid, 'community').subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  askToJoin() {
    this.apiBaseServiceV2.post(`zone/social_network/communities/join`, JSON.stringify({uuid: this.uuid}))
      .subscribe((result: any) => {
          this.invitation = result.data;
        },
        error => {
          console.log('error', error);
        });
  }

  cancelJoinRequest() {
    this.apiBaseServiceV2.delete(`zone/social_network/communities/cancel_invitation/${this.invitation.id}`).subscribe(
      (res: any)=> {
        this.invitation = undefined;
      },
      error => {
        // this.loadingService.stop('.zone-social-cover');
        this.errorMessage = <any>error;
      }
    );
  }

  isMember(): boolean {
    let result: boolean = false;
    _.forEach(this.item.users, (user: any) => {
      if (user.uuid == this.userService.profile.uuid) {
        result = true;
        // return false;
      }
    });
    return result;
  }

  checkJoinRequestStatus() {
    this.apiBaseServiceV2.get(`zone/social_network/communities/${this.uuid}/join_request_status`)
      .subscribe((result: any) => {
          this.invitation = result.data;
        },
        error => {
          console.log('error', error);
        });
  }
}
