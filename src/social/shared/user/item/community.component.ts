import {
  Component, Input, Output, EventEmitter, ComponentFactoryResolver, ViewChild, ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { SocialService } from '../../services/social.service';
import { SocialFavoriteService } from '../../services/social-favorites.service';
import { ZSocialShareCommunityFormEditComponent } from '../../form/edit-community.component';
import { ZSocialShareCommunityFormPreferenceComponent } from '../../form/preferences-community.component';
import { ServiceManager } from '@wth/shared/services';
import { ZSharedReportService } from '@wth/shared/shared/components/zone/report/report.service';
import { Constants } from '@wth/shared/constant';

@Component({
  selector: 'z-social-share-profile-community',
  templateUrl: 'community.component.html',
  styleUrls: ['community.component.scss'],
  entryComponents: [
    ZSocialShareCommunityFormEditComponent,
    ZSocialShareCommunityFormPreferenceComponent
  ]
})
export class ZSocialShareProfileCommunityComponent {
  @Input() data: any;
  @Output() actionFromItem: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;

  modalComponent: any;
  modal: any;

  userSettings: any;
  comUserStatus = Constants.soCommunityUserStatus;
  comUserRole = Constants.communityRole;
  communitiesUrl: string = Constants.urls.communities;

  tooltip: any = Constants.tooltip;

  constructor(public serviceManager: ServiceManager,
              private socialService: SocialService,
              private router: Router,
              private favoriteService: SocialFavoriteService,
              private zoneReportService: ZSharedReportService,
              private resolver: ComponentFactoryResolver) {
  }

  sendJoinRequest() {
    this.socialService.community.askToJoin(this.data.uuid)
      .toPromise().then((result: any) => {
          this.data.user_status = Constants.soCommunityUserStatus.joinRequestSent;
        },
        (error: any) => {
          console.log('error', error);
        });
  }

  viewComDetail(data: any) {
    this.router.navigate(['/' + this.communitiesUrl, data.uuid]);
  }

  toggleFavourite() {
    this.favoriteService.addFavourite(this.data.uuid, 'community')
      .then((res: any) => this.userSettings.favorite = !this.userSettings.favorite);
  }

  confirmLeaveCommunity() {
    this.socialService.community.confirmLeaveCommunity(this.data).then((res: any) => {
        this.actionFromItem.emit(
          {
            action: 'delete',
            data: this.data
          }
        );
      }
    );
  }

  onEdit() {
    this.loadModalComponent(ZSocialShareCommunityFormEditComponent);
    this.modal.onOpenModal(this.data);
    this.modal.modal.element.nativeElement.style.display = 'inline';
  }

  onPreferences() {
    this.loadModalComponent(ZSocialShareCommunityFormPreferenceComponent);
    this.modal.onOpenModal(this.data);
    this.modal.modal.element.nativeElement.style.display = 'inline';
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
    this.socialService.community.getUserSettings(uuid).pipe(take(1)).toPromise().then(
      (res: any) => {
        console.log('inside getUserSettings', res);
        this.userSettings = res.data;
      }
    );
  }

  toggleComNotification(uuid: any) {
    this.socialService.community.toggleComNotification(uuid).toPromise().then(
      (res: any) => {
        console.log('inside toggleComNotification', res);
        this.userSettings = res.data;
      }
    );
  }

  private loadModalComponent(component: any) {
    const modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
    this.modal.setupDataUpdated.subscribe((data: any) => {
      _.merge(this.data, data);
    });

  }
}
