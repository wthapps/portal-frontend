import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import { filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';

import { Constants } from '@shared/constant/config/constants';
import { WUploader } from '@shared/services/w-uploader';
import { CommonEventService, ApiBaseService, CommonEventHandler, CommonEvent } from '@shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { Mixins } from '@shared/design-patterns/decorator/mixin-decorator';
import { MediaAddModalService } from '@shared/modules/photo/components/modal/media/media-add-modal.service';
import { MediaCreateModalService } from '@shared/modules/photo/components/modal/media/media-create-modal.service';
import { AlbumAddMixin, AlbumCreateMixin } from '@shared/modules/photo/mixins';
import { GoogleAnalyticsService } from '@shared/services/analytics/google-analytics.service';

@Mixins([AlbumAddMixin, AlbumCreateMixin])
@Component({
  selector: 'z-media-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZMediaSharedLeftMenuComponent extends CommonEventHandler implements OnInit, OnDestroy,
  AlbumAddMixin,
  AlbumCreateMixin {
  mediaMenu = Constants.pictureMenuItems;

  subAddAlbum: Subscription;
  subOpenCreateAlbum: Subscription;
  subCreateAlbum: Subscription;
  destroy$: Subject<any>;
  selectedObjects: any = [];
  channel = 'ZMediaSharedLeftMenuComponent';

  constructor(
    private renderer: Renderer2,
    private googleAnalytics: GoogleAnalyticsService,
    public commonEventService: CommonEventService,
    public apiBaseService: ApiBaseService,
    public toastsService: ToastsService,
    public mediaAddModalService: MediaAddModalService,
    public mediaCreateModalService: MediaCreateModalService,
    public router: Router,
    public uploader: WUploader) {
    super(commonEventService);
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  updateSelectedObjects(event: CommonEvent) {
    this.selectedObjects = event.payload;
  }

  upload(content_types: any = []) {
    this.uploader.open('FileInput', '.w-uploader-file-input-container', {
      allowedFileTypes: content_types,
      video: true
    });
    this.uploader.event$.pipe(filter(e => e.action === 'complete'), take(1)).subscribe(res => {
      this.commonEventService.broadcast(
        { channel: 'ZMediaPhotoListComponent', action: 'reLoadObjects' }
      );
    });

    this.googleAnalytics.eventEmitter('leftMenu', 'uploadItem');
  }

  /* AlbumCreateMixin This is album create methods, to
custom method please overwirte any method*/
  openCreateAlbumModal: (selectedObjects: any) => void;
  onDoneAlbum: (e: any) => void;
  /* ================================== */

  /* AlbumAddMixin This is album add methods, to
custom method please overwirte any method*/
  openModalAddToAlbum: (selectedObjects: any) => void;
  onAddToAlbum(e: any) {
    this.apiBaseService
      .post(`media/albums/${e.parents[0].id}/photos`, {
        photos: e.children
      })
      .subscribe(res => {
        this.toastsService.success('You just added to Album success');
      });
  }
  onAddedToAlbum: (data: any) => void;
  /* ================================== */


  onCloseMenu() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }
}
