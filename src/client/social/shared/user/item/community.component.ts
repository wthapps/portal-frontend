import {
  Component, OnInit, Input, Output, EventEmitter, ComponentFactoryResolver, ViewChild, ViewContainerRef
} from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';

import { Constants } from '../../../../core/shared/config/constants';
import { ServiceManager } from '../../../../core/shared/services/service-manager';
import { ZoneReportService } from '../../../../core/shared/form/report/report.service';

import { SocialService } from '../../services/social.service';
import { SocialFavoriteService } from '../../services/social-favorites.service';
import { ZSocialShareCommunityFormEditComponent } from '../../form/edit-community.component';
import { ZSocialShareCommunityFormPreferenceComponent } from '../../form/preferences-community.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-share-profile-community',
  templateUrl: 'community.component.html',
  entryComponents: [
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent
  ]
})
export class ZSocialShareProfileCommunityComponent implements OnInit {
  @Input() data: any;
  @Output() actionFromItem: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;

  modalComponent: any;
  modal: any;

  // favourite: any; // toggle favourites status for members, communities
  userSettings: any;
  comUserStatus = Constants.soCommunityUserStatus;
  comUserRole = Constants.communityRole;
  communitiesUrl: string = Constants.urls.communities;

  constructor(public serviceManager: ServiceManager,
              private confirmationService: ConfirmationService,
              private socialService: SocialService,
              private favoriteService: SocialFavoriteService,
              private zoneReportService: ZoneReportService,
              private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  sendJoinRequest() {
    this.socialService.community.askToJoin(this.data.uuid)
      .subscribe((result: any) => {
          // TODO: Update status of community
          this.data.user_status = Constants.soCommunityUserStatus.joinRequestSent;
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  /*
   Params format:
   item: community / member object
   group: community / members
   */
  // getFavourite() {
  //   this.socialService.user.getFavourite(this.data.uuid, 'community').subscribe(
  //     (res: any) => {
  //       this.favourite = res.data;
  //     }
  //   );
  // }

  toggleFavourite() {
    this.favoriteService.addFavourite(this.data.uuid, 'community')
      .then((res: any) => this.userSettings.favorite = !this.userSettings.favorite);
  }

  confirmLeaveCommunity() {
    // Check if there are other admins beside current user in community
    // If not, he must pick another one before leaving
    // let enoughAdmins = community.admin_count > 1 ? true : false;
    // let pickAnotherAdmin = this.userService.profile.uuid == this.item.admin.uuid && !enoughAdmins;
    let pickAnotherAdmin = false;
    let community = this.data;

    this.confirmationService.confirm({
      message: pickAnotherAdmin ?
        `Hi there, you need to pick another admin for the community ${community.name} before leaving.` :
        `Are you sure to leave the community ${community.name}?`,
      header: 'Leave Community',
      accept: () => {
        if (pickAnotherAdmin) {
          // Navigate to member tab
          this.serviceManager.getRouter().navigate([Constants.urls.communities, community.uuid], {
            queryParams: {
              tab: 'members',
              skipLocationChange: true
            }
          });
        } else {
          this.leaveCommunity(community);
        }
      }
    });

    return false;
  }

  leaveCommunity(community: any) {
    this.socialService.community.leaveCommunity(community.uuid)
      .subscribe((res: any) => {
          community.user_status = this.comUserStatus.stranger;
        }
      );
  }

  onEdit() {
    this.loadModalComponent(ZSocialShareCommunityFormEditComponent);
    this.modal.onOpenModal(this.data);
  }

  onPreferences() {
    this.loadModalComponent(ZSocialShareCommunityFormPreferenceComponent);
    this.modal.onOpenModal(this.data);
  }

  onReport(uuid: any) {
    this.zoneReportService.community(uuid);
    return false;
  }

  onDelete() {
    this.socialService.community.confirmDeleteCommunity(this.data).then(
      (community: any) => {
        this.actionFromItem.emit(
          {
            action: 'delete',
            data: community
          }
        );
      }
    );
  }

  getUserSettings(uuid: any) {
    this.socialService.community.getUserSettings(uuid).take(1).subscribe(
      (res: any) => {
        console.log('inside getUserSettings', res);
        this.userSettings = res.data;
      }
    );
  }

  toggleComNotification(uuid: any) {
    this.socialService.community.toggleComNotification(uuid).subscribe(
      (res: any) => {
        console.log('inside toggleComNotification', res);
        this.userSettings = res.data;
      }
    )
  }


  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
    this.modal.setupDataUpdated.subscribe((data: any) => {
      this.data = data;
    });

  }
}
