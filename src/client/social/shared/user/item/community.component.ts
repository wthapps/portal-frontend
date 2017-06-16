import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/api';

import { Constants } from '../../../../core/shared/config/constants';
import { ServiceManager } from '../../../../core/shared/services/service-manager';
import { SocialService } from '../../services/social.service';
import { ZSocialShareCommunityFormEditComponent } from '../../form/edit.component';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-share-profile-community',
  templateUrl: 'community.component.html',
  entryComponents: [
    ZSocialShareCommunityFormEditComponent
  ]
})
export class ZSocialShareProfileCommunityComponent implements OnInit {
  @Input() data: any;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  favourite: any; // toggle favourites status for members, communities
  comUserStatus = Constants.soCommunityUserStatus;
  communitiesUrl: string = Constants.urls.zoneSoCommunities;

  constructor(public serviceManager: ServiceManager,
              private confirmationService: ConfirmationService,
              private socialService: SocialService,
              private resolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }

  sendJoinRequest(community: any) {
    this.socialService.community.askToJoin(community.uuid)
      .subscribe((result: any) => {
          // TODO: Update status of community
          // this.invitationId = result.data.id;
          community.user_status = Constants.soCommunityUserStatus.joinRequestSent;
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
  getFavourite(item: any, group: string) {
    this.socialService.user.getFavourite(item.uuid, group).subscribe(
      (res: any) => {
        this.favourite = res.data;
      }
    );
  }

  toggleFavourite(item: any, group: string) {
    this.socialService.user.toggleFavourites(item.uuid, group).subscribe(
      (res: any) => {
        if (!_.isEmpty(this.favourite)) {
          this.favourite = undefined;
        } else {
          this.favourite = res.data;
        }
      }
    );
  }

  confirmLeaveCommunity(community: any) {
    // Check if there are other admins beside current user in community
    // If not, he must pick another one before leaving
    // let enoughAdmins = community.admin_count > 1 ? true : false;
    // let pickAnotherAdmin = this.userService.profile.uuid == this.item.admin.uuid && !enoughAdmins;
    let pickAnotherAdmin = false;

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
      .subscribe((response: any) => {
          community.user_status = this.comUserStatus.stranger;
        }
      );
  }

  onEdit() {
    this.loadModalComponent(ZSocialShareCommunityFormEditComponent);
    this.modal.data = this.data;
    this.modal.onOpenModal();
  }


  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
